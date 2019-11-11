({
    removeBackgroundColor : function(component, helper) {
        var menuItems = []; 
        menuItems = component.find("menuItems");
        for(var i in menuItems){
            if($A.util.hasClass(menuItems[i],"bg-red")){
                $A.util.removeClass(menuItems[i],"bg-blue");
            }
        }
    },
     showNotfication : function(component,msg,type,title){
        try{
            component.find('notifLib').showToast({
                "title": title,
                "variant":type,
                "message": msg,
                "mode":"dismissable"
            });
            
        }catch(e){
            console.log(e.message)
        }
    }
})