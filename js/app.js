class CalorieTracker{

    constructor(){
        this._calorieLimit=4000;
        this._totalCalories=0;
        this._meals=[];
        this._workouts=[];

        this._displayCaloriesLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this. _displayCaloriesRemaining();
    }

    // Public Methods/API//

    addMeal(meal){
        this._meals.push(meal);
        this._totalCalories+=meal.calories;
        this._displayCaloriesPorgress();
        this._render();

    }

    addWorkout(workout){
        this._workouts.push(workout);
        this._totalCalories-=workout.calories;
        this._render();

    }

    // Private Methods

    _displayCaloriesTotal(){

        const totalelt=document.querySelector('#calories-total');
        totalelt.innerHTML=this._totalCalories;
       
     }

    _displayCaloriesLimit(){
        const calorieLimitEl=document.querySelector('#calories-limit');

        calorieLimitEl.innerHTML=this._calorieLimit;

        
    }

    _displayCaloriesConsumed(){
        const calorieConsumedElt=document.querySelector('#calories-consumed');

        const consumed=this._meals.reduce((total,meal)=> total+meal.calories,0);
        calorieConsumedElt.innerHTML=consumed;
    }

    _displayCaloriesBurned(){
         const calorieBurnedElt=document.querySelector('#calories-burned');

        const burned=this._workouts.reduce((total,workout)=> total+workout.calories,0);
        calorieBurnedElt.innerHTML=burned;
    }

    _displayCaloriesRemaining(){
        const remaining=document.querySelector('#calories-remaining');
        const progressEl=document.querySelector('#calorie-progress');

        let totalRemain= this._calorieLimit-this._totalCalories;
        remaining.innerHTML=totalRemain;

        if(totalRemain<=0){
            remaining.parentElement.parentElement.classList.remove('bg-light');
            remaining.parentElement.parentElement.classList.add('bg-danger');
            progressEl.classList.remove('bg-success');
            progressEl.classList.add('bg-danger');
        }else{
            remaining.parentElement.parentElement.classList.remove('bg-danger');
            remaining.parentElement.parentElement.classList.add('bg-light');

            progressEl.classList.remove('bg-danger');
            progressEl.classList.add('bg-success');

        }

    }

    _displayCaloriesPorgress(){
        const progressEl=document.querySelector('#calorie-progress');
        const percentange=(this._totalCalories/this._calorieLimit)*100;

        const width=Math.min(percentange,100);
        progressEl.style.width=`${width}%`;

    }

    _render(){
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this. _displayCaloriesRemaining();
        this._displayCaloriesPorgress();
    }


    
}


class Meal{
    constructor(name, calories){
        this.id=Math.random().toString(16).slice(2);
        this.name=name;
        this.calories=calories;
    }
}

class Workout{
    constructor(name, calories){
        this.id=Math.random().toString(16).slice(2);
        this.name=name;
        this.calories=calories;
    }
}


// Class App

class App{

    constructor(){
        this._tracker=new CalorieTracker();

        document
            .getElementById('meal-form')
            .addEventListener('submit', this._newMeal.bind(this));
        
        document
            .getElementById('workout-form')
            .addEventListener('submit', this._newWorkout.bind(this));
    }


    _newMeal(e){
        e.preventDefault();

        const name=document.getElementById('meal-name');
        const calories=document.getElementById('meal-calories');
        
        // Validate input

        if(name.value===''|| calories.value===''){
            alert('Please fill in all fields');
            return ;
        }

        const meal=new Meal(name.value, +calories.value);

        this._tracker.addMeal(meal);
        name.value='';
        calories.value='';

        const collapseMeal=document.getElementById('collapse-meal');
        const bscollapse=new bootstrap.Collapse(collapseMeal, {
            toggle:true
        });

        
    }

    _newWorkout(e){
        e.preventDefault();

        const name=document.getElementById('workout-name');
        const calories=document.getElementById('workout-calories');
        
        // Validate input

        if(name.value===''|| calories.value===''){
            alert('Please fill in all fields');
            return ;
        }

        const workout=new Workout(name.value, +calories.value);

        this._tracker.addWorkout(workout);
        name.value='';
        calories.value='';

        const collapseMeal=document.getElementById('collapse-meal');
        const bscollapse=new bootstrap.Collapse(collapseMeal, {
            toggle:true
        });
    }
}

const app=new App();