({
    //apply colors to indicators
    indicatorColorChange : function(component, tafiScore) {
        
        if(parseFloat(tafiScore)==0.0) {  
            //all red
            
            var he1 = component.find("he1");
            var cc1 = component.find("cc1");
            var lp1 = component.find("lp1");
            var g1 = component.find("g1");
            
            $A.util.addClass(he1, "RedIndicators");
            $A.util.addClass(cc1, "RedIndicators");
            $A.util.addClass(lp1, "RedIndicators");
            $A.util.addClass(g1, "RedIndicators");
            
        } else if(parseFloat(tafiScore)>0.0 && parseFloat(tafiScore)<2.0) {
            
            //expenses orange
            var he2 = component.find("he2");
            var cc1 = component.find("cc1");
            var lp1 = component.find("lp1");
            var g1 = component.find("g1");
            
            $A.util.addClass(he2, "OrangeIndicators");
            $A.util.addClass(cc1, "RedIndicators");
            $A.util.addClass(lp1, "RedIndicators");
            $A.util.addClass(g1, "RedIndicators");
            
        } else if(parseFloat(tafiScore)>=2.0 && parseFloat(tafiScore)<2.25) {
            
            //expenses green, loan orange
            
            var he3 = component.find("he3");
            var cc1 = component.find("cc1");
            var lp2 = component.find("lp2");
            var g1 = component.find("g1");
            
            $A.util.addClass(he3, "GreenIndicators");
            $A.util.addClass(cc1, "RedIndicators");
            $A.util.addClass(lp2, "OrangeIndicators");
            $A.util.addClass(g1, "RedIndicators");
            
        } else if(parseFloat(tafiScore)>=2.25 && parseFloat(tafiScore)<4) {
            
            //credit card orange and loan green
            var he3 = component.find("he3");
            var cc2 = component.find("cc2");
            var lp3 = component.find("lp3");
            var g1 = component.find("g1");
            
            $A.util.addClass(he3, "GreenIndicators");
            $A.util.addClass(cc2, "OrangeIndicators");
            $A.util.addClass(lp3, "GreenIndicators");
            $A.util.addClass(g1, "RedIndicators");
            
        } else if(parseFloat(tafiScore)>=4 && parseFloat(tafiScore)<5.0) {
            
            //credit card green, Goal orange
            
            var he3 = component.find("he3");
            var cc3 = component.find("cc3");
            var lp3 = component.find("lp3");
            var g2 = component.find("g2");
            
            $A.util.addClass(he3, "GreenIndicators");
            $A.util.addClass(cc3, "GreenIndicators");
            $A.util.addClass(lp3, "GreenIndicators");
            $A.util.addClass(g2, "OrangeIndicators");
            
        } else {
            console.log('inside green');
            //all green
            var he3 = component.find("he3");
            var cc3 = component.find("cc3");
            var lp3 = component.find("lp3");
            var g3 = component.find("g3");
            
            $A.util.addClass(he3, "GreenIndicators");
            $A.util.addClass(cc3, "GreenIndicators");
            $A.util.addClass(lp3, "GreenIndicators");
            $A.util.addClass(g3, "GreenIndicators");
        }
            
    },
    
    //removes colors from the indicatos set by previous method
    indicatorColorRemove : function(component){
        	var he1 = component.find("he1");
            var cc1 = component.find("cc1");
            var lp1 = component.find("lp1");
            var g1 = component.find("g1");
        
            var he2 = component.find("he2");
            var cc2 = component.find("cc2");
            var lp2 = component.find("lp2");
            var g2 = component.find("g2");
        
            var he3 = component.find("he3");
            var cc3 = component.find("cc3");
            var lp3 = component.find("lp3");
            var g3 = component.find("g3");
        	
            $A.util.removeClass(he1, "RedIndicators");
        	$A.util.removeClass(cc1, 'RedIndicators');
        	$A.util.removeClass(lp1, 'RedIndicators');
       	    $A.util.removeClass(g1, 'RedIndicators');
        	
        	$A.util.removeClass(he2, 'OrangeIndicators');
        	$A.util.removeClass(cc2, 'OrangeIndicators');
        	$A.util.removeClass(lp2, 'OrangeIndicators');
       	    $A.util.removeClass(g2, 'OrangeIndicators');
        
        	$A.util.removeClass(he3, 'GreenIndicators');
        	$A.util.removeClass(cc3, 'GreenIndicators');
        	$A.util.removeClass(lp3, 'GreenIndicators');
       	    $A.util.removeClass(g3, 'GreenIndicators');

    },
 
    
    //Toast message for foul data creation
    showToast : function(component, selectedClient) {
        var toastEvent = $A.get("e.force:showToast");
        console.log('Selected Client: '+selectedClient);
        toastEvent.setParams({
            "mode": 'sticky',
            "title": "Tip!",
            "message": "Create Proper Data For "+ selectedClient
        });
        toastEvent.fire();
    }
})