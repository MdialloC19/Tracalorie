class CalorieTracker{

    constructor(){
        this._calorieLimit=Storage.getCalorieLimit(2000);
        this._totalCalories=+Storage.getTotalCalories(0);
        // console.log(Storage.getTotalCalories(100))
        this._meals=Storage.getMeals();
        this._workouts=Storage.getWorkouts();

        this._displayCaloriesLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
        
    }

    // Public Methods/API//

    addMeal(meal){
        this._meals.push(meal);
        this._totalCalories+=meal.calories;
        this.setTotal(this._totalCalories);
        Storage.saveMeal(meal);
        this._displayNewItems('meal',meal);
        this._render();

    }

    addWorkout(workout){
        this._workouts.push(workout);
        this._totalCalories-=workout.calories;
        this.setTotal(this._totalCalories);
        Storage.saveWorkout(workout);
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

    reset() {
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];
        this._render();
    }
    setLimit(limit){
        this._calorieLimit=limit;
        Storage.setCalorieLimit(limit);
        this._displayCaloriesLimit();
        this._render();
    }
    
    setTotal(total){
        this._totalCalories=total;
        Storage.setTotalCalories(total);
        this._displayCaloriesTotal();
        this._render();

    }
    loasItems(){
        this._meals
            .forEach(meal=> this._displayNewItems('meal',meal));
        this._workouts
            .forEach(workout=> this._displayNewItems('workout',workout));
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


// Storage Class

class Storage{
    static getCalorieLimit(defaultLimit){
        let calorieLimit;
        if(localStorage.getItem('calorieLimit')===null){
            calorieLimit=defaultLimit;
        }else{
            calorieLimit=+localStorage.getItem('calorieLimit');
        }
        return calorieLimit;
    }

    static setCalorieLimit(calorieLimit){
        localStorage.setItem('calorieLimit', calorieLimit);
    }

    static getTotalCalories(defaultTotal){
        let totalCalories;
        if(localStorage.getItem('totalCalories')===null){
            totalCalories=defaultTotal;
        }else{
            totalCalories=+localStorage.getItem('totalCalories');
        }
        return totalCalories;
    }

    static setTotalCalories(totalCalories){
        localStorage.setItem('totalCalories', totalCalories);
    }

    static getMeals(){
        let meals;
        if(localStorage.getItem('meals')===null){
            meals=[];
        }else{
            meals=JSON.parse(localStorage.getItem('meals'));
        }
        return meals;
    }

    static saveMeal(meal){
        const meals= Storage.getMeals();
        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static getWorkouts(){
        let workouts;
        if(localStorage.getItem('workouts')===null){
            workouts=[];
        }else{
            workouts=JSON.parse(localStorage.getItem('workouts'));
        }
        return workouts;
    }

    static saveWorkout(workout){
        const workouts= Storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }
}

// Class App

class App{

    constructor(){
        this._tracker=new CalorieTracker();
        this._tracker.loasItems();
        this._loadEventListeners();
    }

    _loadEventListeners(){
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
        
        document
            .getElementById('filter-meals')
            .addEventListener('keyup',this._filterItems.bind(this, 'meal'));

        document
            .getElementById('filter-workouts')
            .addEventListener('keyup',this._filterItems.bind(this,'workout'));

        document
            .getElementById('reset')
            .addEventListener('click', this._reset.bind(this));
        
        document
            .getElementById('limit-form')
            .addEventListener('submit', this._setLimit.bind(this));
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

    _filterItems(type,e){
        const text=e.target.value.toLowerCase();
        document.querySelectorAll(`#${type}-items .card`).forEach(item=>{
            const name=item.firstElementChild.firstElementChild.textContent;
            if(name.toLowerCase().indexOf(text)!==-1){
                item.style.display='block';
                
            }else{
                item.style.display='none';
            }
        });
    }

    _reset(){
        this._tracker.reset();
        document.getElementById('meal-items').innerHTML='';
        document.getElementById('workout-items').innerHTML='';
        document.getElementById('filter-meals').innerHTML='';
        document.getElementById('filter-workouts').innerHTML='';
        
    }

    _setLimit(e){
        e.preventDefault();
        const limit=document.getElementById('limit');
         if (limit.value === '') {
            alert('Please add a limit');
            return;
        }
        this._tracker.setLimit(+limit.value);
        limit.value='';
        const modalEl = document.getElementById('limit-modal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
        
    }
}

const app=new App();