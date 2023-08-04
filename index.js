
import express from 'express'
import {engine} from 'express-handlebars'
import bodyParser from 'body-parser';
import SettingsBill from './settings-bill.js';
import moment from 'moment';

const app = express();
const settingsBill = SettingsBill()

app.engine('handlebars', engine({
    layoutsDir: "./views/layouts"
}));
app.set('view engine', 'handlebars');
app.set('views', './views')
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())



app.get('/', function(req, res){
    res.render('index', {
        settings: settingsBill.getSettings(),
        totals : settingsBill.totals()
    });
});

app.post('/settings', function(req, res){


settingsBill.setSettings({
    callCost : req.body.callCost,
    smsCost : req.body.smsCost,
    warningLevel :req.body.warningLevel,
    criticalLevel : req.body.criticalLevel

});
    res.redirect('/');

});

app.post('/action', function(req, res){
    settingsBill.recordAction(req.body.actionType); 
    res.redirect('/');
});

app.get('/actions', function(req, res){
    const timeFromNow = settingsBill.actions().map(time => {
        return{
        type: time.type, 
        cost : time.cost,
        timestamp : moment(time.timestamp).fromNow()
    }})

    res.render('actions', {actions: timeFromNow });
});
app.get('/actions/:actionType', function(req, res){
    const actionType =  req.params.actionType;
    res.render('actions', {actions: settingsBill.actionsFor(actionType) });
});

const PORT = process.env.PORT || 3011;

app.listen(PORT, function(){
    console.log("App started at port:", PORT)
})