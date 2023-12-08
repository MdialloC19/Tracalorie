
import Storage from "./Storage";
class CalorieTracker{

    constructor(){
        this._calorieLimit=Storage.getCalorieLimit(2000);
        this._totalCalories=+Storage.getTotalCalories(0);
        this._meals=Storage.getMeals();
        this._workouts=Storage.getWorkouts();
        this._displayCaloriesLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
       

        document.getElementById('limit').value=this._calorieLimit; 
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
            Storage.removeMeal(id);
            this._render();
        }
    }

    removeWorkout(id) {
        const index = this._workouts.findIndex((workout) => workout.id === id);
        if (index !== -1) {
            const workout = this._workouts[index];
            this._workouts.splice(index, 1);
            Storage.removeWorkout(id);
            this._totalCalories += workout.calories;
            this._render();
        }
    }
    

    reset() {
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];
        Storage.clearAll();
        this._displayCaloriesLimit();
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
        this._displayChartMeal();
        this._displayChartWorkout();
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

    _displayChartMeal(){
        const ctx = document.getElementById('myChart-1');
        const meals=Storage.getMeals();
         if (window.myChartMeal) {
            window.myChartMeal.destroy();
        }

        window.myChartMeal=new Chart(ctx, {
            type: 'bar',
            data: {
            labels: meals.map((meal)=>meal.name),
            datasets: [{
                label: 'calories by meal',
                data: meals.map((meal)=>meal.calories),
                borderColor: '#36A2EB',
                backgroundColor: '#9BD0F5',
                borderWidth: 1
            }]
            },
                options: {
                scales: {
                    y: {
                    beginAtZero: true
                    }
                }
            }
        });
    }

    _displayChartWorkout(){
        const ctx1 = document.getElementById('myChart-2');
        const workouts = Storage.getWorkouts();
        
        // Vérifie si le graphique existe déjà et le détruit s'il est présent
        if (window.myChartWorkout) {
            window.myChartWorkout.destroy();
        }

        window.myChartWorkout= new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: workouts.map((workout) => workout.name),
                datasets: [{
                    label: 'Calories by workout',
                    data: workouts.map((workout) => workout.calories),
                    borderColor: '#FF6384',
                    backgroundColor: '#FFB1C1',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }



    _render(){
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this. _displayCaloriesRemaining();
        this._displayCaloriesProgress();
        this._displayChartMeal();
        this._displayChartWorkout(); 
    }
}


export default CalorieTracker;