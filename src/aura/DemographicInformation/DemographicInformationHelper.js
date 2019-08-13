({
    validateData:function(component,event){
        
        
    },
    showNotfication : function(component,msg,type,title){
        //console.log("inhelper");
        try{
            // component.set("v.errors", [{message:"Invalid field: " }]);
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