import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Order } from "./order.model";
import { StaticDataSource } from "./static.datasource";
import { RestDataSource, ProductOrder } from "./rest.datasource";

@Injectable()
export class OrderRepository {
    private orders: Order[] = [];
    private loaded: boolean = false;
    
    constructor(private dataSource: RestDataSource) {}
    
    loadOrders() {
        this.loaded = true;
        this.dataSource.getOrders()
            .subscribe(orders => this.orders = <Order[]>orders);
    }

    getOrders(): Order[] {
        if (!this.loaded) {
            this.loadOrders();
        }
        return this.orders;
    }

    saveOrder(order: Order): Observable<ProductOrder> {
        return this.dataSource.saveOrder(order);
    }

    updateOrder(order: Order) {
        this.dataSource.updateOrder(order).subscribe(odr => {
            this.orders.splice(this.orders.
                findIndex(o => o.id == (order as Order).id), 1, odr as Order);
        });
    }

    deleteOrder(id: number) {
        this.dataSource.deleteOrder(id).subscribe(order => {
            this.orders.splice(this.orders.findIndex(o => id == o.id));
        });
    }
}