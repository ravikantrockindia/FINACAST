({
    doInit: function(component, event, helper) 
    {
        
        
        helper.APiList(component, helper);
        
        window.setInterval(
            $A.getCallback(function() { 
                helper.APiList(component,helper);
            }), 360000000000000 );
        
    },
    
    
})