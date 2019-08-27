({	
    doInit:function(component,event,helper){
    helper.fetchImage(component,event,helper);
},
    itemsChange:function(component,event,helper){
    helper.fetchImage(component,event,helper);
},
	handleProfile : function(component, event, helper) {
		component.set("v.isEditTrue",true);
        component.set("v.isImageAvailable",true);
        var cmpTarget = component.find('change');
       	$A.util.removeClass(cmpTarget, "slds-hide"); 
	},
    closeModel:function(component,event,helper){
    component.set("v.isEditTrue",false);
    component.set("v.isImageAvailable",false);    
}
})