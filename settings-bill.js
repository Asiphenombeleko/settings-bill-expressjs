import moment from "moment";
export default function SettingsBill() {

    let smsCost;
    let callCost;
    let warningLevel;
    let criticalLevel;

    let actionList = [];

    function setSettings(settings) {

        smsCost = Number(settings.smsCost);
        callCost = Number(settings.callCost);
        warningLevel = settings.warningLevel;
        criticalLevel = settings.criticalLevel;
    }

    function getSettings
        () {
        return {
            smsCost,
            callCost,
            warningLevel,
            criticalLevel
        }
    }

    function recordAction(action) {

        let cost = 0;
        
        if (action === 'sms') {
            cost = smsCost;
        }
        else if (action === 'call') {
            cost = callCost;
        }
        if (cost > 0 && !hasReachedCriticalLevel()){

            actionList.push({
                type: action,
                cost: cost,
                timestamp: new Date()
            });
        }

    }


    function actions() {
        return actionList;
    }


    function actionsFor(type) {
        const filteredActions = [];
        const timeFromNow = actionList.map(time => {
            return {
                type: time.type,
                cost: time.cost.toFixed(2),
                timestamp: moment(time.timestamp).fromNow()
            }
        })

        // loop through all the entries in the action list 
        for (let index = 0; index < timeFromNow.length; index++) {
            const action = timeFromNow[index];
            // check this is the type we are doing the total for 
            if (action.type === type) {
                // add the action to the list
                filteredActions.push(action);
            }
        }

        return filteredActions;

       
    }

    function getTotal(type) {
        let total = 0;
        // loop through all the entries in the action list 
        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];
            // check this is the type we are doing the total for 
            if (action.type === type) {
                // if it is add the total to the list
                total += action.cost;
            }
        }
        return total;
        }


    function grandTotal() {

        return getTotal('sms') + getTotal('call');
    }

    function totals() {

        let smsTotal = getTotal('sms').toFixed(2)
        let callTotal = getTotal('call').toFixed(2)

        return {
            smsTotal,
            callTotal,
            grandTotal: grandTotal().toFixed(2)
        }
    }

    function hasReachedWarningLevel() {
        const total = grandTotal();
        const reachedWarningLevel = total >= warningLevel
            && total < criticalLevel;

        return reachedWarningLevel;
    }

    function hasReachedCriticalLevel() {
        const total = grandTotal();

        return total >= criticalLevel;
    }
    function levelsReached() {
        if (hasReachedWarningLevel()) {
            return "warning";
        } else if (hasReachedCriticalLevel()) {
            return "danger";
        }

    }
    function reset(){
        actionList.length = 0;
    }

    return {
        setSettings,
        getSettings,
        recordAction,
        actions,
        actionsFor,
        totals,
        hasReachedWarningLevel,
        hasReachedCriticalLevel,
        levelsReached,
        reset

    }
}