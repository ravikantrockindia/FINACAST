trigger User_Trigger on User (after insert) {
    if(Trigger.isafter && trigger.isinsert)
    {
        User_TriggerHandler.addUsertoGrp(trigger.new);
    }
}