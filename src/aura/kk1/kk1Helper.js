({
    fetchAccHelper : function(component, event, helper) {
alert('hey');
        var action = component.get("c.ColumnSet");

        action.setParams({

        });

        action.setCallback(this, function(response){
			var bbbbb =  response.getReturnValue().lstSObject;
            console.log('bbbbb'+bbbbb);

           
				component.set("v.mycolumns", response.getReturnValue().lstFields);
                component.set("v.acctList", bbbbb);

          

        });

        $A.enqueueAction(action);

    }

})