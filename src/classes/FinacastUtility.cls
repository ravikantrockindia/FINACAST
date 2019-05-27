public class FinacastUtility {
    
    public static Id getRecordTypeId(String objectAPIName , String recordTypeName)
    {
        return database.query('select id from recordtype where recordtype.developername =: recordTypeName and  SobjectType =:objectAPIName ' ).id;
        
    }
    
    // Pass in the endpoint to be used using the string url, request Type, and post data in any else pass 0
    public static String getCalloutResponseContents(String url, String requestName, String postData) {
        
        String userName = 'finacastapi';
        String password = 'mytafi@123';
        // Instantiate a new http object
        Http h = new Http();
        
        // Instantiate a new HTTP request, specify the method (GET) as well as the endpoint	 
        HttpRequest request = new HttpRequest();
        request.setEndpoint(url);
        request.setTimeout(12000);
        request.setMethod(requestName);
        System.debug(postData);
        
        if(requestName =='POST'){
            request.setHeader('Content-Type', 'application/json;charset=UTF-8');
            //Authenticate the org
            request.setHeader('Authorization', 'Basic '+ EncodingUtil.base64Encode(Blob.valueOf(username+':'+password)));
            //set request body
            request.setBody(postData);
        }
        
        // Send the request, and return a response
        HttpResponse response = h.send(request);
        
        //check Status and debug response
        System.debug('Status Code: ' + response.getStatusCode());
        System.debug('Response: ' + response.getBody());
        
        //return response
        return response.getBody();
    }
    @AuraEnabled
    public static void ExceptionHandle(Integer LineNumber, String Message,string StackTrace)
    {
        Exception_Details__c ex =new Exception_Details__c();
        ex.Message__c = Message;
        ex.Line_Number__c = LineNumber;
        ex.Stack_Trace__c = StackTrace;
        insert ex;
        
        
    }
    
    
}