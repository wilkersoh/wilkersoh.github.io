let budget = (function(){

     let Expense = function(id, desc, value){
         this.id = id;
         this.desc = desc;
         this.value = value;
         this.percentage = -1;
     };

     Expense.prototype.calcPercentage = function(totalIncome){
        totalIncome > 0 ? 
        this.percentage = Math.round((this.value / totalIncome) * 100) :
        this.percentage = -1;
     };
     

     Expense.prototype.getPercentage = function(){
         return this.percentage;
     }

     let Income = function(id, desc, value){
         this.id = id;
         this.desc = desc;
         this.value = value;
     };

     let calculateTotal = function(type){
        let sum = 0;

        data.allItems[type].forEach((c) => {
            sum += c.value;
        });
        data.totals[type] = sum;
     }

     let data = {
         allItems: {
             exp: [],
             inc: [],
         },
         totals: {
             exp: 0,
             inc: 0,
         },
         budget: 0,
         percentage: -1,
     };

    

     return {
         addItem: function(type, des, val){
            let newItem, ID;

            /*
            ID = 0 1 2 3 4 5 length 6, index 5
            ID = 0 1 3 4 5 6 length - 1 = 5, + 1 
            ID = 1 2 3 4 5 6
            */
           
            data.allItems[type].length > 0 ? 
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1 : 
            ID = 0;


            type === 'exp' ? newItem = new Expense(ID, des, val) : 
            newItem = new Income(ID, des, val);

            data.allItems[type].push(newItem);

            return newItem;
         },

         calculateBudget: function(){
            calculateTotal('exp');
            calculateTotal('inc');

            //  budget = 100 - 80 
            data.budget = data.totals.inc - data.totals.exp;

            /* 
            84/ 100 = 0.84
            0.84 = 0.8
            0.8 * 100 = 80 
            */
            data.totals.inc > 0 ? 
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100) :
            data.percentage = -1;
         },

         calcPercentage: function(){
             /**
              a = 20
              b = 10
              c = 40
              inc = 100
              a = 20/100 =20%
              b = 10/100 = 10%
              c = 40/100 = 40%
              */

              data.allItems.exp.forEach((c) =>{
                  c.calcPercentage(data.totals.inc);
              });
         },

         getPercentage: function(){
            let allPerc = data.allItems.exp.map((c) => {
                return c.getPercentage();
            })
            return allPerc;
         },



         getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
            }
         },

         deleteITem: function(type, id){
            let ids, i;

            /*
            id = 6
            data.allItems[type][id];
            ids = [1 2 4 6 8]
            i = 3
            */ 

            ids = data.allItems[type].map((c) => {
                return c.id;
            });

            i = ids.indexOf(id);

            if(i !== -1){
                data.allItems[type].splice(i, 1);
            }

         },

         see: () => {
             console.log(data);
         }
     }

})();





let UI = (function(){
 let Domstrings = {
    inputType: '.add__type',
    inputDesc: '.add__description',
    inputValue:'.add__value',
    inputBtn: '.add__btn',
    incContainer: '.income__list',
    expContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month',

 }

 let formatNumber = function(num, type){
    let numSplit, int, dec;

    /**
        1345.4322 -> 1,345.43
        1000 -> 1,000.00     
     */

     num = Math.abs(num)
     num = num.toFixed(2);

     /**become array */
     numSplit = num.split('.');

     int = numSplit[0];
     
     
     int.length > 3 ?
     int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3) : false; //13450 -> 13,450

     dec = numSplit[1];

     return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
 };





 return {
     
     getInput: () => {
        //  return to get the target and value
         return {
            type: document.querySelector(Domstrings.inputType).value,
            desc: document.querySelector(Domstrings.inputDesc).value,
            value: parseFloat(document.querySelector(Domstrings.inputValue).value),
         }
     },

     addListItem: function(obj, type){
        let html, newHtml, domElement;

        if(type === 'inc'){
            domElement = Domstrings.incContainer;

            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        } else if (type === 'exp') {
            domElement = Domstrings.expContainer;

            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }

        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%desc%', obj.desc);
        newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

        document.querySelector(domElement).insertAdjacentHTML('beforeend', newHtml);
     },

     displayBudget: function(obj){

        obj.budget > 0 ? type = 'inc' : type = 'exp'

        document.querySelector(Domstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(Domstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
        document.querySelector(Domstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');


        obj.percentage > 0 ? 
        document.querySelector(Domstrings.percentageLabel).textContent = obj.percentage + '%':
        document.querySelector(Domstrings.percentageLabel).textContent = '---';


     },

     displayPercentages: function(p){
        let fields = document.querySelectorAll(Domstrings.expensesPercLabel);

        let nodeListForEach = function(list, callback){
            for (let i = 0; i < list.length; i++){
                callback(list[i], i);
            }
        };

        nodeListForEach(fields, function(c, i){

            p[i] > 0 ?
            c.textContent = p[i] + '%' :
            c.textContent = '---';

        })
        

        /**Clean code */
        // fields.forEach(function(c, i){
        //     p[i] > 0 ?
        //     c.textContent = p[i] + '%' :
        //     c.textContent = '---'
        // })
     },

     displayMonth: function(){
        let now, months, month, year;

        now = new Date();
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        month = now.getMonth();
        year = now.getFullYear();

        document.querySelector(Domstrings.dateLabel).textContent = months[month] + ' ' + year;
     },

    changeType: function(){
        let f = document.querySelectorAll(
            Domstrings.inputType + ',' + 
            Domstrings.inputDesc + ',' +
            Domstrings.inputValue
        );

        f.forEach(function(c, i){
            c.classList.toggle('red-focus');
        })

        document.querySelector(Domstrings.inputBtn).classList.toggle('red');
    },


     

     clearInput: function(){
        let f, fArr;

        f = document.querySelectorAll(Domstrings.inputDesc + ',' + Domstrings.inputValue);

        fArr = Array.prototype.slice.call(f);
        fArr.forEach(function(c){
            c.value = '';
        });

        fArr[0].focus();
     },

     deleteListItem: function(selectorID){
        let el = document.getElementById(selectorID);
        el.parentNode.removeChild(el);
     },


     getDOMstrings: () => {
         return Domstrings;
     },

 }
})();




let Controller = ((budgetCtrl, UICtrl) => {

    const setupEventLisners = () => {
        let DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', (e) => {
            if(e.keyCode === 13 || e.which == 13){
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UI.changeType);
    };

    const updateBudget = function(){


        budgetCtrl.calculateBudget();

        let budget = budgetCtrl.getBudget();

        UI.displayBudget(budget);


    };

    const updatePercentages = function(){
        budget.calcPercentage();

        let percentages = budget.getPercentage();


        UI.displayPercentages(percentages);
    };

    const ctrlAddItem = () => {
        let input, newItem;

        // get value from DOM   
        input = UICtrl.getInput();

        if(input.desc !== '' && !isNaN(input.value) && input.value > 0){

            // get value from budget controller
            newItem = budgetCtrl.addItem(input.type, input.desc, input.value);

            // display in UI
            UI.addListItem(newItem, input.type);

            // clear input
            UI.clearInput();

            updateBudget();

            updatePercentages();

        }

    };


    const ctrlDeleteItem = function(e){

        let itemID, splitID, type, ID;
        
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
        

        if(itemID){

            /* inc-1 */
            splitID = itemID.split('-');
            type = splitID[0];

            /**js is horrible - string to number */
            ID = parseInt(splitID[1]);
 
            // Delete from data 
            budget.deleteITem(type, ID);

            // Delete from UI list
            UI.deleteListItem(itemID);

            updateBudget();

            updatePercentages();

        }
    };


 return {
     init: () => {
        setupEventLisners();
        UI.displayMonth();
        UI.displayBudget({
            budget: .001,
            totalInc: 0,
            totalExp: 0,
            percentage: -1,
        });
        alert('No RWD PAGE');
     }
 }
})(budget, UI)

Controller.init();

