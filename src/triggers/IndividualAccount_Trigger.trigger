trigger IndividualAccount_Trigger on Account (after insert) {
    
    if(Trigger.isafter && trigger.isinsert)
    {
      IndividualAccountTriggerHandler.createPublicGroup(Trigger.new);  
    }
}