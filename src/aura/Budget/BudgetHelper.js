({
    removeBackgroundColor : function(component, helper) {
        var menuItems = []; 
        menuItems = component.find("menuItems");
        for(var i in menuItems){
            if($A.util.hasClass(menuItems[i],"bg-red")){
                $A.util.removeClass(menuItems[i],"bg-blue");
            }
        }
    }
})