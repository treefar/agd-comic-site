// This receipt certifies selected current flows, never the complete release gate.
const verify=require('../reports/ui-polish-20261023/root/verify-current.cjs');
module.exports=function(root,policy,read){
 if(!policy.ui_polish_receipt)return {verified:false};
 read(policy.ui_polish_receipt,false);
 return verify(root,policy.ui_polish_receipt,{deep:false});
};
