# Abstract-custom-tables
Abstract-custom-tables is a personal project built to display current MEAN stack standards for data transportation and manipulation from the database to the front-end, as well as demonstrate abstract-custom-tables library for customizing angular material tables with passable configuration. It applies abstraction and generics to achieve scalability and flexibility, while keeping the code clean and easily understandable. The angular library is [publshed on npm](https://www.npmjs.com/package/ngx-abstract-table) and its documentation can be found there.

## Back-end
NodeJS back-end logic is separated into database, controller and router layers.
Example for fetching all item details

### Database layer:
In the database layer we call the database using the Mongoose ODM library for mapping data
```
/**
 * Method fetches item details and returns the item with its details
 * @param itemId - Specifies item id
 * @returns Promise<Item>
 */
const getItemWithDetails = async (itemId) => {
    return Item.findById(itemId).populate('details', '-__v').select('-__v');
}
```
```
/**
 * Mongoose item model schema with reference to detail document
 */
const itemSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    type: { type: String, required: false },
    price: { type: String },
    createdAt: { type: Date },
    details: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'detail'
        }
    ]
});
```

### Controller layer:
In the controller layer we validate the request, call the database and create a response
```
/**
 * Method parses the request, validates sent data, attempts to fetch all item details
 * and returns the adequate status response
 */
exports.getItemDetails = async (req, res) => {
    try {
        const {id} = req.query;

        if (!(id)){
            const response = utils.mapResponse(400, "Bad input");
            return res.status(400).json(response);
        }

        const itemWithDetails = await database.getItemWithDetails(id);
        const response = utils.mapResponse(200, "Successfully fetched item details", itemWithDetails.details);
        res.status(200).json(response);
    } catch (error) {
        const response = utils.mapResponse(500, `Oops, something went wrong: ${error.message}`);
        return res.status(500).json(response);
    }
}
```
### Router layer:
In the router layer we map the route to the controller function and add the authentication middleware
```
router.get('/item-details', auth, homeController.getItemDetails);
```

## Front-end
Front-end logic is separated through multiple layers and files.
Data is manipulated using RxJS streams for scalability and ease of change.

### Service layer:
In the service layer we call the back-end, handle all outcomes and expect an observable as the return value
```
/**
   * Method creates a http get request to fetch all item details and returns a mapped observable array.
   * If error is omitted, it's handled and an empty array is returned in an observable.
   * As the observable will be subscribed on again, shareReplay will make it a hot observable and it is not going to create another request to the db,
   * instead shareReplay will create a ReplaySubject, that subscribes to our source observable, and we subscribe to it
   */
  public fetchItemDetails(id: string): Observable<Detail[]> {
    return this.http.get<ApiResponse<DetailResponse[]>>(this.url.concat('item-details'), {
      params: {
        id: id
      },
      headers: this.utilsService.initHeaders()
    }).pipe(
      map((response: ApiResponse<DetailResponse[]>) => response.data.map(item => this.detailMapper.map(item))),
      catchError((errResponse: ApiResponse<any>) => this.utilsService.handleApiError(errResponse, [])),
      shareReplay()
    );
  }
```

#### If successful
We will use injectable mapper class which implements generic interface with a single map function
```
/**
 * Injectable detail mapper which converts a detail response to a mapped detail
 */
@Injectable({providedIn: "root"})
export class DetailMapper implements Mapper<Detail> {
  public map(item: DetailResponse): Detail {
    return new Detail(
      item._id,
      item.name,
      item.value
    );
  }
}
```

#### If unsuccessful
We will use the global error handler to display a dialog with the error message and omit the passed value as an observable
```
/**
   * Method handles the back-end errors and displays dialogs with the message returned from the failed http request.
   * @param errorResponse - Specifies the back-end error
   * @param returnValue - Specifies the return value needed for the web-app to continue to run as intended
   */
  public handleApiError(errorResponse: ApiResponse<any> | HttpErrorResponse, returnValue: any): Observable<any> {
    const dialogData: CustomDialogData = {
      title: errorResponse instanceof HttpErrorResponse ? this.setTitle(errorResponse.error.code) : this.setTitle(errorResponse.code),
      message: errorResponse instanceof HttpErrorResponse ? errorResponse.error.message : errorResponse.message,
      icon: 'error',
      action: 'Okay'
    }
    if ((errorResponse instanceof HttpErrorResponse && errorResponse.error.code === 401) ||
        (<ApiResponse<any>>errorResponse).code === 401){
        this.router.navigate(['']).then(() => {});
    }

    this.dialog.open(CustomDialogComponent, {
      data: dialogData,
      width: '400px'
    });
    return of(returnValue);
  }
```

### Component layer
In component layer we expect mapped data to be passed along into child components or to be displayed
```
/**
   * Method fetches all item details and places them in details observable array
   */
  public fetchItemDetails(): void {
    if (this.selectedItem){
      this.details$ = this.shoppingService.fetchItemDetails(this.selectedItem.id);
    }
  }
```

```
<ngx-custom-table
  [configuration]="configuration"
  [data]="items$ | async"
  [details]="details$ | async"
  [filterConfiguration]="filterConfiguration"
  [paginatorConfiguration]="paginatorConfiguration"
  [sortConfiguration]="sortingConfiguration"
  [styleConfiguration]="styleConfiguration"
  [fetch]="fetchAllItemsPages.bind(this)"
  (rowClicked)="itemClicked($event)"
  (childClicked)="childClicked($event)">
</ngx-custom-table>
```

## End result
![Homepage-Image](https://github.com/jerinic-dusan/abstract-custom-tables/blob/master/homepage.png)

## Updates
App will get new updates depending on if there is any need for them. For now, I hope anyone that uses it gets a good use out of it.

## Non-commercial use
This app is my personal project, and it does not have direct or indirect income-generating use. It will not be marketed or sold.

## Links
* [GitHub](https://github.com/jerinic-dusan)
* [LinkedIn](https://www.linkedin.com/in/dusan-jerinic/)
