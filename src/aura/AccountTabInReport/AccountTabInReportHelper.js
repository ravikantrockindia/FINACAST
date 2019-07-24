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
    doInit : function(component, event, helper) {
       
        var workspaceAPI = component.find("workspace");
        var tab=component.get("v.tabName")
        console.log('tab',tab)
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            console.log('tab id',focusedTabId )
            workspaceAPI.setTabLabel({
                label: tab
            });
        })
        .catch(function(error) {
            console.log(error);
        });   
        component.set("v.parentInitialised", true);   
    },
})