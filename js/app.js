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
        this._displayCaloriesProgress();
        
    }

    // Public Methods/API//

    addMeal(meal){
        this._meals.push(meal);
        this._totalCalories+=meal.calories;
        this._displayNewItems('meal',meal);
        this._render();

    }



    addWorkout(workout){
        this._workouts.push(workout);
        this._totalCalories-=workout.calories;
        this._displayNewItems('workout',workout);
        this._render();

    }

    removeMeal(id){
        const index=this._meals.findIndex((meal)=>meal.id===id);
        if(index!==-1){
            const meal = this._meals[index];
            this._totalCalories-=meal.calories;
            this._meals.splice(index,1);
            this._render();
        }
    }

    removeWorkout(id) {
        const index = this._workouts.findIndex((workout) => workout.id === id);
        if (index !== -1) {
            const workout = this._workouts[index];
            this._workouts.splice(index, 1);
            this._totalCalories += workout.calories;
            this._render();
        }
  }

    // Private Methods

    _displayNewItems(type, item){
        const div=document.createElement('div');
        div.classList.add('card','my-2');
        div.setAttribute('data-id', item.id);
        div.innerHTML=`
              <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${item.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                   ${item.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            `;
        document.getElementById(`${type}-items`).appendChild(div);
    }

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

    _displayCaloriesProgress(){
        const progressEl=document.querySelector('#calorie-progress');
        const percentange=(this._totalCalories/this._calorieLimit)*100;

        const width=Math.min(percentange,100);
        if(width>0)
            progressEl.style.width=`${width}%`;
        else
            progressEl.style.width=`0%`;

    }

    _render(){
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this. _displayCaloriesRemaining();
        this._displayCaloriesProgress();
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
            .addEventListener('submit', this._newItem.bind(this, 'meal'));
        
        document
            .getElementById('workout-form')
            .addEventListener('submit', this._newItem.bind(this, 'workout'));
        
        document
            .getElementById('meal-items')
            .addEventListener('click', this._removeItem.bind(this,'meal'));
        document
            .getElementById('workout-items')
            .addEventListener('click', this._removeItem.bind(this,'workout'));
    }

    _removeItem(type,e){

        if( e.target.classList.contains('delete')|| 
            e.target.classList.contains('fa-xmark')){
                if(confirm('Are you sure ?')){
                    const id= e.target.closest('.card').getAttribute('data-id');
                    type==='meal'
                        ?this._tracker.removeMeal(id)
                        :this._tracker.removeWorkout(id);

                    e.target.closest('.card').remove();
                }

        }



    }


    _newItem(type,e){
        e.preventDefault();

        const name=document.getElementById(`${type}-name`);
        const calories=document.getElementById(`${type}-calories`);
        
        // Validate input

        if(name.value===''|| calories.value===''){
            alert('Please fill in all fields');
            return ;
        }
        if(type==='meal'){
            const meal=new Meal(name.value, +calories.value);
            this._tracker.addMeal(meal);
        }else{
            const workout=new Workout(name.value, +calories.value);
            this._tracker.addWorkout(workout);
        }
        name.value='';
        calories.value='';

        const collapse=document.getElementById(`collapse-${type}`);
        const bscollapse=new bootstrap.Collapse(collapse, {
            toggle:true
        });

    }

}

const app=new App();