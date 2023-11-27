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

        const burned=this._meals.reduce((total,meal)=> total+meal.calories,0);
        calorieBurnedElt.innerHTML=burned;
    }
    _displayCaloriesRemaining(){
        const remaining=document.querySelector('#calories-remaining');
        let totalRemain= this._calorieLimit-this._totalCalories;
        remaining.innerHTML=totalRemain;
    }

    _render(){
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this. _displayCaloriesRemaining();
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

const traker =new CalorieTracker();

const breakfast= new Meal('Breakfast', 400);
const run =new Workout('Morning Run', 500);

traker.addWorkout(run);
traker.addMeal(breakfast);
console.log(traker._meals);
console.log(traker._workouts);
// console.log(traker._totalCalories);
