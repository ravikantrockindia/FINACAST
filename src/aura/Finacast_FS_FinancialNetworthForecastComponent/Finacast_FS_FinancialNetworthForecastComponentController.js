({
	    //3. Networth Tab
    shownetWorthData : function(component, event, helper) {
        /*var data = component.get("v.data");
        var obj = data.netWorthAnalysis;
        var isEmpty = helper.emptyCheck(component, obj);
        if(isEmpty){
             component.set("v.isEmptyData", true);
        }
        else{
            component.set("v.isEmptyData", false);
             helper.showNetworth(component);
        }*/
        
        helper.showNetworth(component);
    },
    
    //3.1 Networth for next year
    showNetWorthPrev:function(component,event,helper){
        helper.prevNetworth(component);
    },
    
    //3.2 Networth for previous year
    showNetWorthNext:function(component,event,helper){
        helper.nextNetworth(component);
    },
    
    openHelpBox:function(component,event,helper){
        component.set("v.helpBox",true);
        //console.log(component.get("v.helpBox"));
    },
    
    closeHelpBox:function(component,event,helper){
       // console.log("close help box");
        component.set("v.helpBox",false);        
    },
})