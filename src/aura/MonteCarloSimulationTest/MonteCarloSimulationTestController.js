({
    doInit :function(component, event, helper){     
        var gid = component.get("v.childgid");
        console.log("Gid: " + gid);   
        var action = component.get("c.Pageinit");
        
        action.setParams({
            gid : gid
        });       
        
        action.setCallback(this, function(response){
            var gdetails = response.getReturnValue().goalInitialValues;
            component.set("v.picklistValues", response.getReturnValue().pickListValues);
            console.log("Json Response:" +JSON.stringify(response.getReturnValue()));
                     
            if ($A.util.isUndefinedOrNull(gdetails[0]["Start_Value__c"])) {
                console.log("hey");
                gdetails[0]["Start_Value__c"] = 0;
            }
            
            component.set("v.IA",parseInt(gdetails[0]["Start_Value__c"]));
            component.set("v.AS",parseInt((gdetails[0]["Required_Monthly_Saving__c"])*12));
            component.set("v.TA",parseInt(gdetails[0]["FinServ__TargetValue__c"]));
            component.set("v.TD",gdetails[0]["FinServ__TargetDate__c"]);
            //component.set("v.Vol",4.0);
            
        });
        $A.enqueueAction(action); 
    },
    
    simulate : function(component, event, helper) {
        var initialAmount = component.find("initialAmount").get("v.value");
        var annualSaving = component.find("annualSaving").get("v.value");
        var targetAmount = component.find("targetAmount").get("v.value");
        var volatility = component.find("volatility").get("v.value");
        var targetDate = component.find("targetDate").get("v.value");
        var riskProfile = component.find("riskProfile").get("v.value");
        console.log(riskProfile); 
        var confidenceValues=[];
        var map = new Map();
        
        console.log("Initial Amount: " + initialAmount);
        console.log(typeof(initialAmount));       
        console.log("target amount:" +targetAmount);
        console.log(typeof(targetAmount));        
        
        var action = component.get("c.sample");
        action.setParams({
            goalinitialAmount : initialAmount,
            goaltargetAmount : targetAmount,
            goalMonthlySaving : annualSaving,
            goalTargetDate : targetDate,
            riskProfile : riskProfile,
            volatility : volatility
        });
        
        action.setCallback(this, function(response){
            var sdMap = response.getReturnValue();
            component.set("v.standardDeviationValueMap", sdMap);
            console.log("Returned Values: "+ JSON.stringify(sdMap));
        });
        $A.enqueueAction(action); 
    },
    
    
    // use when the Normal Chart is plotted Dynamically
   /* generateChart: function (component, event, helper) { 
        var SDMap = component.get("v.standardDeviationValueMap");
        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,  
            title:{
                text: "Predicted Values"
            },
            axisY:{
                title: "",
                tickLength: 0,
                lineThickness:0,
                margin:0,
                valueFormatString:" " //comment this to show numeric values
            },
            data: [{
                yValueFormatString: "$#,###",
                xValueFormatString: "SD",
                type: "splineArea",
                /*dataPoints: [
                    {x: 3, y: SDMap["13"], label:"2006"},
                    {x: 2, y: SDMap["12"]},
                    {x: 1, y: SDMap["11"]},
                    {x: 0, y: SDMap["0"]},
                    {x: -1, y: SDMap["1"]},
                    {x: -2, y: SDMap["2"]},
                    {x: -3, y: SDMap["3"]},                    
                ] 
                dataPoints: [
                    {x: 3, y: 500, label:SDMap["13"]},
                    {x: 2, y: 2000, label:SDMap["12"]},
                    {x: 1, y: 7000, label:SDMap["13"]},
                    {x: 0, y: 9000, label:SDMap["0"]},
                    {x: -1, y: 7000, label:SDMap["1"]},
                    {x: -2, y: 2000, label:SDMap["2"]},
                    {x: -3, y: 500, label:SDMap["3"]},                    
                ]
                    }]
            });
                   chart.render();                   
                   } */
                   })