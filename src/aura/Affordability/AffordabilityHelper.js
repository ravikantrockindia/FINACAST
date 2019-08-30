({
    resetCompareHelper: function (component, event, helper) {
        var opts = [
            { value: "buy", label: "Buy Now" },
            { value: "nobuy", label: "Don't Buy Now" },   
            ];
        component.set("v.Comparetab",false);
        component.set("v.currentselectedValue","buy");
        component.set("v.futureselectedValue","nobuy");
        component.set("v.options1",opts);
        component.set("v.options2",opts);
	            
    }
})