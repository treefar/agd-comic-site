// Pure CLR late binding for one read-only Word attempt. No PowerShell byref arguments.
using System;
using System.IO;
using System.Text;
using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection;
using System.Web.Script.Serialization;

public static class LegacyDocExtractor {
  static string output;
  static int ownedId;
  static HashSet<int> oldIds;
  static JavaScriptSerializer serializer = new JavaScriptSerializer { MaxJsonLength=Int32.MaxValue, RecursionLimit=100 };
  static object Get(object target,string name) { return target.GetType().InvokeMember(name,BindingFlags.GetProperty,null,target,null); }
  static void Set(object target,string name,object value) { target.GetType().InvokeMember(name,BindingFlags.SetProperty,null,target,new object[]{value}); }
  static object Call(object target,string name,object[] args) { return target.GetType().InvokeMember(name,BindingFlags.InvokeMethod|BindingFlags.OptionalParamBinding,null,target,args); }
  static void Json(string name,object value) { File.WriteAllText(Path.Combine(output,name),serializer.Serialize(value),new UTF8Encoding(false)); }
  static Dictionary<string,object> Row() { return new Dictionary<string,object>(); }
  static void Stage(string stage) { Json("office-stage.json",new { stage=stage, at=DateTime.UtcNow.ToString("o"),owned_process_id=ownedId }); Console.WriteLine("STAGE "+stage); }
  static void AssertOwnedHidden(object word) {
    List<Process> newer=new List<Process>();
    foreach(Process p in Process.GetProcessesByName("WINWORD")) if(!oldIds.Contains(p.Id)) newer.Add(p);
    if(newer.Count!=1 || newer[0].Id!=ownedId) throw new InvalidOperationException("No unique new Word PID; refusing to use an existing/user instance");
    Process owned=newer[0];
    if(owned.MainWindowHandle!=IntPtr.Zero || !String.IsNullOrEmpty(owned.MainWindowTitle) || Convert.ToBoolean(Get(word,"Visible"))) throw new InvalidOperationException("Visible/interactive Word window; stopping");
  }
  static void Release(object value) { if(value!=null && System.Runtime.InteropServices.Marshal.IsComObject(value)) System.Runtime.InteropServices.Marshal.FinalReleaseComObject(value); }
  public static int Run(string outDir,string inputDir) {
    output=outDir;
    if(Directory.Exists(output)) throw new InvalidOperationException("Fresh attempt-r3 directory required");
    Directory.CreateDirectory(output);
    object word=null,document=null,options=null,documents=null,oldLinks=null;
    Exception failure=null;
    oldIds=new HashSet<int>();foreach(Process p in Process.GetProcessesByName("WINWORD"))oldIds.Add(p.Id);
    Json("process-before.json",new { ids=new List<int>(oldIds),at=DateTime.UtcNow.ToString("o") });
    List<object> rows=new List<object>();
    try {
      Stage("creating-dedicated-instance");
      word=Activator.CreateInstance(Type.GetTypeFromProgID("Word.Application",true));
      Set(word,"Visible",false);Set(word,"DisplayAlerts",0);Set(word,"AutomationSecurity",3);
      options=Get(word,"Options");oldLinks=Get(options,"UpdateLinksAtOpen");Set(options,"UpdateLinksAtOpen",false);
      List<Process> newer=new List<Process>();foreach(Process p in Process.GetProcessesByName("WINWORD"))if(!oldIds.Contains(p.Id))newer.Add(p);
      if(newer.Count!=1)throw new InvalidOperationException("Cannot establish unique dedicated Word ownership");
      ownedId=newer[0].Id;
      AssertOwnedHidden(word);
      documents=Get(word,"Documents");if(Convert.ToInt32(Get(documents,"Count"))!=0)throw new InvalidOperationException("Unexpected existing document in new instance");
      Json("office-instance.json",new { owned_process_id=ownedId,start_time=newer[0].StartTime.ToUniversalTime().ToString("o"),prior_word_ids=new List<int>(oldIds),dedicated_new_instance=true,application_visible=Get(word,"Visible"),main_window_handle=newer[0].MainWindowHandle.ToInt64(),word_version=Get(word,"Version"),automation_security=Get(word,"AutomationSecurity"),display_alerts=Get(word,"DisplayAlerts"),update_links_at_open=Get(options,"UpdateLinksAtOpen"),method="CLR Type.InvokeMember; plain object[]" });
      foreach(string name in new string[]{"recognition","evaluation"}) {
        AssertOwnedHidden(word);
        string source=Path.Combine(inputDir,"department-"+name+".doc"),copy=Path.Combine(output,"input-"+name+".doc");
        File.Copy(source,copy,false);
        Stage("opening-read-only-"+name);
        object m=Type.Missing;
        object[] args=new object[]{copy,false,true,false,m,m,false,m,m,m,m,false,false,false,m,true};
        document=Call(documents,"Open",args);
        AssertOwnedHidden(word);
        if(!Convert.ToBoolean(Get(document,"ReadOnly")))throw new InvalidOperationException("Document is not read-only");
        Stage("extracting-"+name);
        object content=Get(document,"Content");string text=Convert.ToString(Get(content,"Text"));Release(content);
        string xml=Convert.ToString(Get(document,"WordOpenXML"));
        File.WriteAllText(Path.Combine(output,name+"-content.txt"),text,new UTF8Encoding(false));
        File.WriteAllText(Path.Combine(output,name+"-flat.xml"),xml,new UTF8Encoding(false));
        object tables=Get(document,"Tables"),paragraphs=Get(document,"Paragraphs"),shapes=Get(document,"Shapes"),inlineShapes=Get(document,"InlineShapes"),fields=Get(document,"Fields");
        object row=new { name=name,source=source,opened_copy=copy,read_only=Get(document,"ReadOnly"),text_characters=text.Length,flat_xml_characters=xml.Length,table_count=Get(tables,"Count"),paragraphs=Get(paragraphs,"Count"),shapes=Get(shapes,"Count"),inline_shapes=Get(inlineShapes,"Count"),fields=Get(fields,"Count"),saved=Get(document,"Saved") };
        Json(name+"-office.json",row);rows.Add(row);
        Release(tables);Release(paragraphs);Release(shapes);Release(inlineShapes);Release(fields);
        Call(document,"Close",new object[]{0,Type.Missing,Type.Missing});Release(document);document=null;
        Stage("closed-no-save-"+name);
      }
      Json("office-results.json",rows);
      Console.WriteLine("SUCCESS documents="+rows.Count);
    } catch(Exception ex) {
      failure=ex;
      Json("office-error.json",new { at=DateTime.UtcNow.ToString("o"),error=ex.ToString(),owned_process_id=ownedId });
      Console.Error.WriteLine(ex.ToString());
    } finally {
      try { if(document!=null){Call(document,"Close",new object[]{0,Type.Missing,Type.Missing});Release(document);document=null;} } catch(Exception ex){Json("close-error.json",new { error=ex.ToString(),owned_process_id=ownedId });failure=ex;}
      try { if(word!=null){if(options!=null&&oldLinks!=null)Set(options,"UpdateLinksAtOpen",oldLinks);Call(word,"Quit",new object[]{0,Type.Missing,Type.Missing});} } catch(Exception ex){Json("quit-error.json",new { error=ex.ToString(),owned_process_id=ownedId });failure=ex;}
      Release(documents);Release(options);Release(word);
      GC.Collect();GC.WaitForPendingFinalizers();
      bool running=false;try{Process.GetProcessById(ownedId);running=true;}catch(ArgumentException){}
      Json("process-after.json",new { at=DateTime.UtcNow.ToString("o"),owned_process_id=ownedId,owned_process_still_running=running });
      Stage("dedicated-instance-quit-no-save");
    }
    return failure==null?0:1;
  }
}
