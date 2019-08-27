({
    APiList: function(component, helper) {
        var action = component.get("c.getCalloutResponseContents"); 
        action.setParams({
            "url": 'https://api.worldtradingdata.com/api/v1/stock?symbol=^INX,^DJI,^IXIC,^NYA&api_token=W3WHMBuNhqeVx5ZIMC5d5xr5nGDDxON2ubfjv5LwzLACjt92xz2m99pRVXGN'
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                component.set("v.response", response.getReturnValue());
                
                component.set('v.DownJonesprice',JSON.parse(response.getReturnValue().data[0].price));
                component.set('v.SPprice',JSON.parse(response.getReturnValue().data[1].price));
                component.set('v.NASDAQprice',JSON.parse(response.getReturnValue().data[2].price));
                component.set('v.NYSEprice',JSON.parse(response.getReturnValue().data[3].price));
                
                component.set('v.DownJonespercent',JSON.parse(response.getReturnValue().data[0].change_pct));
                component.set('v.SPpercent',JSON.parse(response.getReturnValue().data[1].change_pct));
                component.set('v.NASDAQpercent',JSON.parse(response.getReturnValue().data[2].change_pct));
                component.set('v.NYSEpercent',JSON.parse(response.getReturnValue().data[3].change_pct));
                
                var timezone = response.getReturnValue().data[0].timezone;
                component.set("v.timezoneTime",timezone);
                var DownJonespercent =JSON.parse(response.getReturnValue().data[0].change_pct);
                if (DownJonespercent >0){
                    component.set("v.istrue",true);
                    component.set("v.istrueDownJones",true);
                    
                } 
                else{
                    component.set("v.istrue",false);
                    component.set("v.istrueDownJones",false);
                    
                }
                var SPpercent =JSON.parse(response.getReturnValue().data[1].change_pct);
                
                if (SPpercent >0){
                    component.set("v.istrue",true);
                    component.set("v.istrueSP",true);
                } 
                else{
                    component.set("v.istrue",true);
                    component.set("v.istrueSP",false);
                    
                }
                var NASDAQpercent =JSON.parse(response.getReturnValue().data[2].change_pct);
                if (NASDAQpercent >0){
                    component.set("v.istrue",true);
                    component.set("v.istrueNASDAQ",true);
                } 
                else{
                    component.set("v.istrue",true);
                    component.set("v.istrueNASDAQ",false);
                    
                }
                var NYSEpercent =JSON.parse(response.getReturnValue().data[3].change_pct);
                if (NYSEpercent >0){
                    component.set("v.istrue",true);
                    component.set("v.istrueNYSE",true);
                } 
                else{
                    component.set("v.istrue",true);
                    component.set("v.istrueNYSE",false);
                    
                }
                var today = new Date();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                
                component.set("v.timelatest",time);
                
                
                var getAllRates = component.get("v.response")['data'];
                var dataList = JSON.stringify(getAllRates);
            }
        });
        
        $A.enqueueAction(action);
        
    }, 
    
    
})