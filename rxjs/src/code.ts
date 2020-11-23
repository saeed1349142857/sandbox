import { Observable } from 'rxjs'
import { Subject } from 'rxjs'
import {fromEvent} from 'rxjs';

const mousemoveObservable = fromEvent(document, 'mousemove');
setTimeout(() => {
    const subscription = mousemoveObservable.subscribe(
        (x : any) => addItem(x)
    );
}, 2000);


const observable = Observable.create((observer: any) => {
    try {
        observer.next('Hey Guys1');
        observer.next('How are you');
        setInterval(() => {
            observer.next('I am good');
        }, 2000);
        //observer.complete();
        //observer.next('This will not send');
    } catch(err) {
        observer.error(err);
    }
});

const observer = observable.subscribe(
    (x: any) => addItem(x),
    (error: any) => addItem(error),
    () => addItem('Completed')
);

// const observer2 = observable.subscribe(
//     (x: any) => addItem(x),
//     (error: any) => addItem(error),
//     () => addItem('Completed')
// );

// observer.add(observer2);

// setTimeout(() => {
//     observer.unsubscribe();
// }, 6001);

setTimeout(() => {
 const observer2 = observable.subscribe(
     (x: any) => addItem('Subscriber 2' + x),
     (error: any) => addItem(error),
     () => addItem('Completed')
 );
}, 1000);

function addItem(val:any) {
    var node = document.createElement("li");
    var textnode = document.createTextNode(val);
    node.appendChild(textnode);
    document.getElementById("output").appendChild(node);
}
