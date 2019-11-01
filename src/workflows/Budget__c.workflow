<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <fieldUpdates>
        <fullName>May_yearly_tax_deduction_allowed_c_defau</fullName>
        <description>set to value zero ,when new Record created</description>
        <field>May_yearly_tax_deduction_allowed__c</field>
        <formula>0</formula>
        <name>May yearly tax deduction allowed c defau</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
        <reevaluateOnChange>true</reevaluateOnChange>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>UpdateEndDate</fullName>
        <field>End_Date__c</field>
        <formula>DATE(YEAR(DATEVALUE(CreatedDate)) + 10, MONTH(DATEVALUE(CreatedDate)), DAY(DATEVALUE(CreatedDate)))</formula>
        <name>UpdateEndDate</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>update_start_date</fullName>
        <field>Start_Date__c</field>
        <formula>TODAY()</formula>
        <name>update start date</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <rules>
        <fullName>Income and expense start date is today</fullName>
        <actions>
            <name>UpdateEndDate</name>
            <type>FieldUpdate</type>
        </actions>
        <actions>
            <name>update_start_date</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Budget__c.Start_Date__c</field>
            <operation>equals</operation>
        </criteriaItems>
        <criteriaItems>
            <field>Budget__c.End_Date__c</field>
            <operation>equals</operation>
        </criteriaItems>
        <triggerType>onCreateOrTriggeringUpdate</triggerType>
    </rules>
    <rules>
        <fullName>May yearly tax deduction allowed c default value</fullName>
        <actions>
            <name>May_yearly_tax_deduction_allowed_c_defau</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Budget__c.May_yearly_tax_deduction_allowed__c</field>
            <operation>equals</operation>
        </criteriaItems>
        <description>May yearly tax deduction allowed c default value to Zero</description>
        <triggerType>onCreateOrTriggeringUpdate</triggerType>
    </rules>
</Workflow>
