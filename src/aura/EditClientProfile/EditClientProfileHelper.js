({
    validateData:function(component,event){
        var name=component.find("name").get("v.value")
        var category=component.find("category").get("v.value")
        
        var street=component.find("street").get("v.value")
        
        var dob=component.find("dob").get("v.value")         
        
        var city=component.find("city").get("v.value")
        
        var state=component.find("state").get("v.value")
        
        var code=component.find("code").get("v.value")
        
        if ($A.util.isUndefinedOrNull(name) || name == "" ||  
            $A.util.isUndefinedOrNull(category) || category == "" || $A.util.isUndefinedOrNull(street) || 
            street ==""  || $A.util.isUndefinedOrNull(dob) || dob =="" || $A.util.isUndefinedOrNull(city) || city ==""  
            || $A.util.isUndefinedOrNull(state) || state ==""  || $A.util.isUndefinedOrNull(code) || code =="" )
            
        {
            return false;     
        }
        else{
            var d=new Date()
            var dob=new Date(dob)
            //
            if(dob>d){
                event.preventDefault();
                
                var msg = "You cannot enter a future DoB!"
                this.showNotfication(component,msg,"error","Error!");
            }              
            //
          /*  var timediff=new Date().getTime() - dob.getTime();
            if(timediff<0){
                event.preventDefault();
                var msg = "Age must be atleast 18!"
                this.showNotfication(component,msg,"error","Error!");
            }*/
            var yeardiff=new Number((new Date().getTime() - dob.getTime()) / 31536000000)
            console.log('yeardiff',yeardiff)
            if(yeardiff<18){
                
                event.preventDefault();
                
                var msg = "Age must be atleast 18 to proceed further!"
                this.showNotfication(component,msg,"error","Error!");    
            }
            
            
            
        }
        return true;
    },
    showAlertEmptyInvalidVal : function(component,msg){
        
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            type : "error",
            "title": "Error!",
            "message": msg
        });
        toastEvent.fire();
    },
    MAX_FILE_SIZE: 1500000, //Max file size 1.5 MB 
    CHUNK_SIZE: 750000,      //Chunk Max size 750Kb 
    
    uploadHelper: function(component, event) {        
        component.set("v.showLoadingSpinner", true);
        var fileInput = component.find("fileId").get("v.files");
        var file = fileInput[0];
        var self = this;  
        if (file.size > self.MAX_FILE_SIZE) {
            component.set("v.showLoadingSpinner", false);
            //component.set("v.fileName", 'Alert : File size cannot exceed ' + self.MAX_FILE_SIZE + ' bytes.\n' + ' Selected file size: ' + file.size);
            component.set("v.fileName", 'File size cannot exceed 1.5MB');
            return;
        }
        
        var objFileReader = new FileReader();
        objFileReader.onload = $A.getCallback(function() {
            var fileContents = objFileReader.result;
            var base64 = 'base64,';
            var dataStart = fileContents.indexOf(base64) + base64.length;
            
            fileContents = fileContents.substring(dataStart);
            self.uploadProcess(component, file, fileContents);
        });
        
        objFileReader.readAsDataURL(file);
    },
    
    uploadProcess: function(component, file, fileContents) {
        var startPosition = 0;
        var endPosition = Math.min(fileContents.length, startPosition + this.CHUNK_SIZE);
        this.uploadInChunk(component, file, fileContents, startPosition, endPosition, '');
    },
    
    
    uploadInChunk: function(component, file, fileContents, startPosition, endPosition, attachId) {
        var getchunk = fileContents.substring(startPosition, endPosition);
        var action = component.get("c.saveChunk");
        action.setParams({
            parentId: component.get("v.recordId"),
            fileName: file.name,
            base64Data: encodeURIComponent(getchunk),
            contentType: file.type,
            fileId: attachId
        });
        var tChange="";
        
        action.setCallback(this, function(response) {
            
            var attachId = response.getReturnValue();
            component.set("v.attachId",attachId);
            var DefaultImg=component.get("v.DefaultImg");
            var c=component.get('v.prefixURL') + component.get('v.attachId');
            if(DefaultImg===true){
                component.set("v.TempFinalVal",c);
                var tChange=component.get("v.TempFinalVal");
            }else{
                component.set("v.ResourceImage",c);
                var tChange=component.get("v.ResourceImage");
            }
            
            var state = response.getState();
            if (state === "SUCCESS") {
                
                startPosition = endPosition;
                endPosition = Math.min(fileContents.length, startPosition + this.CHUNK_SIZE);
                
                if (startPosition < endPosition) {
                    this.uploadInChunk(component, file, fileContents, startPosition, endPosition, attachId);
                } else {
                    component.set("v.showLoadingSpinner", false);
                }
                
            } else if (state === "INCOMPLETE") {
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        
        $A.enqueueAction(action);
        component.set("v.fileName", '');
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