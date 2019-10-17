({
    doInit: function(component, event, helper) 
    {	
        debugger;
 
        helper.APiList(component, helper);
        
        window.setInterval(
            $A.getCallback(function() { 
                helper.APiList(component,helper);
            }), 360000000000000 );
        
        
    },
    
    
})