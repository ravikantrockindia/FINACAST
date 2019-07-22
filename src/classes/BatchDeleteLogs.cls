public class BatchDeleteLogs implements DataBase.Batchable<sObject> {
    
    public Iterable<sObject> start(Database.BatchableContext bc) {
        return [Select Id from Apexlog Limit 1];
    }

    public void execute(Database.BatchableContext bc, List<ApexLog> records){
           
            for(Apexlog al: records){
                Http h = new Http();
                HttpRequest req = new HttpRequest();
                req.setEndpoint(Url.getOrgDomainUrl().toExternalForm()
                + '/services/data/v44.0/sobjects/Apexlog/'+al.Id);
                req.setMethod('DELETE');
                req.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId());
                HttpResponse res = h.send(req);
                System.debug(res.getStatusCode());
            }
            
            System.debug('loglist'+records);
    }    

    public void finish(Database.BatchableContext bc){
        
    }    

    
}