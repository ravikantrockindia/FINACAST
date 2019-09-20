({	
	  doInit : function(component, event, helper) {
       
         
        var txnId=component.get("v.Tid");
          if(txnId!=null){  
        helper.generateChart(component, event, helper);   
          }
      }  
})