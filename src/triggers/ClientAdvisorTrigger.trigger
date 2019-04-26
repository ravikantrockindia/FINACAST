/***
* created by: avneet kaur
* purpose: to create client advisor on inserting a new account record
* handler : ClientAdvisorHandler
***/

trigger ClientAdvisorTrigger on Account (after insert, before Delete) {
    
    if(Trigger.isafter )
    {
        if(Trigger.isinsert)
        {
            ClientAdvisorHandler.createClientAdvisor(Trigger.new);
        }
    }
    if(Trigger.isbefore )
        
    {
        if(Trigger.isDelete)
        {
            ClientAdvisorHandler.deleteClientAdvisor(Trigger.old);
        }
    }
}