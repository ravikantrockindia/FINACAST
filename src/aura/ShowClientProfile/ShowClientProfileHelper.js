({
	fetchImage:function(component,event,helper){
   	var action = component.get("c.fetchLatestImage");
        var recordID=component.get("v.recordId");
        action.setParams({
            cid: recordID             
        });
    action.setCallback(this, function(response) {
            var state = response.getState();
            if( state === 'SUCCESS') {
                var attId=response.getReturnValue();
                if(attId!=null){
                    component.set("v.DefaultImg",true);
                    //       var attId=response.getReturnValue();
                    component.set('v.attachId',attId);
                    var c=component.get('v.prefixURL') + component.get('v.attachId');
                    component.set("v.FinalVal",c);
                    component.set("v.TempFinalVal",c);  
                }else{
                     component.set("v.DefaultImg",false);
                }
                
            } 
        });
    $A.enqueueAction(action);
    }

})