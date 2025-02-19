import {AngularFirestore, DocumentData, QuerySnapshot} from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import sha256 from 'crypto-js/sha256';
import { Observable,Subject,elementAt,lastValueFrom,map, takeUntil} from 'rxjs';
import { ProductOperationsModel } from '../models/ProductOperationsModel';
import { ProductChainModel } from '../models/ProductChainModel';

@Injectable({
  providedIn: 'root'
})
export class FirebaseConfigService {

  constructor(public firestore:AngularFirestore) { }

  getCurrentDate(): string {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hour}:${minute}:${second}`;
  }

  computeHash(
    nonce:number,
    prevHash:string,
    timeStamp:string,
    operationText:string,
    productModelNo:string,
    uuid:string,
    productId:string,
    ){
    let inputString = 
    nonce + 
    prevHash + 
    timeStamp + 
    operationText +
    productModelNo +
    uuid +
    productId;
    return sha256(inputString).toString();
  } 
  
  
  getProductBlockChainList():Observable<any> {
    return this.firestore.collection("ProductChain").valueChanges();
  }


  async getDataFromFirestore(): Promise<{ prevHash: string; nonce: number }> {
    return new Promise((resolve, reject) => {
      let prevHash: string;
      let nonce: number;
  
      this.firestore.collection('ProductChain').valueChanges().subscribe(result => {
        if(result.length == 0){
          prevHash = "#0"
        }
        else{
          result.forEach(e => {
            var recvdData = JSON.parse(JSON.stringify(e, this.getCircularReplacer()));
            prevHash = recvdData['hash'];
          });
        }
        nonce = result.length + 1;
  
        resolve({ prevHash, nonce });
      }, error => {
        reject(error);
      });
    });
  }

  async addDataToProductChain(dataMap:any,updateMap:any){
    let nonceString = dataMap['nonce'].toString();
    console.log("Updating for nonce:"+nonceString)
    await this.firestore.collection("ProductChain").doc(nonceString).set(dataMap);  
    await this.firestore.collection("ProductChain").doc(nonceString).collection("updateMap").doc("1").set(updateMap);
  }

  async isProdcutIdAvailable(productId: string): Promise<boolean> {
    try {
      const productData = await this.checkProductById(productId);
      if (productData != null) {
        console.log("Product found, Data: ", productData);
        return false;

      } else {
        console.log("Product not found!");
        return true;
      }
    } catch (error) {
      console.error("Error checking product availability: ", error);
      return false;
    }
  }

  async updateOperation(operationText: string, nc: string | null,prodId: string | null): Promise<void> {
    let nonce:string = nc??"-1";
    let productId:string = prodId??"-1";
    console.log("N:"+nonce+"prodId:"+prodId);
    const collection = this.firestore.collection('ProductChain').doc(nonce.toString()).collection("updateMap");
    try {
      let totalOperations:number = -1;
      let prevHash = "NA"
      const unsubscribe$ = new Subject<void>();

      collection.valueChanges().pipe( 
        takeUntil(unsubscribe$)
        // Unsubscribe when unsubscribe$ emits
      ).      
      subscribe(
        docsList => {
          totalOperations = docsList.length;
          docsList.forEach(doc => {
            prevHash = doc["currentHash"];
            console.log(prevHash);
          });
      
          // Perform the document creation and update logic inside the subscription's callback
          let timeStamp = this.getCurrentDate();
          let transID = "TRS"+(totalOperations+1)+"/"+productId;
          let currentHash = sha256(""+timeStamp+""+transID+""+prevHash+""+operationText).toString();
          
          let dataMap = {
            "id": totalOperations+1,
            "timeStamp": timeStamp,
            "operation": operationText,
            "transID": transID,
            "currentHash": currentHash,
            "prevHash": prevHash
          };
          console.log("Final DATA MAP" + JSON.stringify(dataMap));
      
          // Update the document in the collection
          collection.doc((totalOperations+1).toString()).set(dataMap)
            .then(() => {
              console.log("Document updated successfully");
            })
            .catch(error => {
              console.error("Error updating document:", error);
            });
      
          // Emit a completion signal if all elements in the docsList have been processed
          if (totalOperations === docsList.length) {
            unsubscribe$.next();
            unsubscribe$.complete();
          }
        }
      )

      await this.sleep(3000);

      
      // let timeStamp = this.getCurrentDate();
      // let transID = "TRS"+(totalOperations+1)+"/"+prodId;
      // let currentHash = sha256(""+timeStamp+""+transID+""+prevHash+""+operationText).toString();
      // let dataMap = {
      //   "id":totalOperations+1,
      //   "timeStamp":timeStamp,
      //   "operation":operationText,
      //   "transID":transID,
      //   "currentHash":currentHash,
      //   "prevHash":prevHash
      // }
      // console.log("Final DATA MAP"+JSON.stringify(dataMap));


      // await collection.doc(totalOperations.toString()).update(dataMap);
    } catch (error) {
      console.error('Error creating new document:', error);
      throw error;
    }
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // async getDocumentIds(collectionPath: string): Promise<Observable<any[]>> {
  //   return this.firestore.collection(collectionPath).get().pipe(
  //     map(snapshot => snapshot.docs.map(doc => doc.id))
  //   );
  // }

  // async getDocumentsCount(collectionPath: string): Promise<number> {
  //   let count:number = -1;
  //    await this.firestore.collection(collectionPath).valueChanges().subscribe((actionArray:any[])=>{
  //     actionArray.map((item:any)=>{
  //       console.log(item);
  //     })
  //    });
  //   return count;  
  // }

  // getLastDocument(collectionPath: string): Observable<any> {
  //   return this.firestore.collection(collectionPath, ref => ref.orderBy('timestamp', 'desc').limit(1))
  //     .snapshotChanges()
  //     .pipe(
  //       map(actions => {
  //         if (actions.length === 0) {
  //           return null;
  //         }
  //         return actions[0].payload.doc.data();
  //       })
  //     );
  // }


  getProductById(productId: string): Observable<any> {
    return this.firestore.collection("ProductChain", ref => ref.where("productId", '==', Number.parseInt(productId))).valueChanges();
  }

  checkProductById(productId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firestore.collection('ProductChain').doc(productId).snapshotChanges()
        .pipe(
          map(doc => {
            if (doc.payload.exists) {
              const data = doc.payload.data();
              //console.log("Product exists - getProductById:", data);
              return data;
            } else {
              //console.log("Product doesn't exist");
              return null;
            }
          })
        )
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getOperationsById(nonce:string):Observable<any> {
    return this.firestore.collection("ProductChain").doc(nonce.toString()).collection("updateMap").valueChanges();
  }



  // getDocumentByFieldValueOld(productId: string): Observable<any[]> {
  //   return this.firestore.collection('ProductChain', ref => ref.where("productId", '==', productId)).snapshotChanges().pipe(
  //     map(actions => {
  //       return actions.map(action => {
  //         return action.payload.doc.data();
  //       });
  //     })
  //   );
  // }

  // async getProductById(productId: string): Promise<any> {
  //   try {
  //     const snapshot = await this.firestore.collection("ProductChain", ref => ref.where("productId", '==', productId)).get().toPromise();
  //     if (snapshot) {
  //       return snapshot.docs.map(doc => {
  //         const data = doc.data();
  //         //const id = doc.id;
  //         console.log(data);
  //         return data;
  //       });
  //     } else {
  //       console.error('Snapshot is undefined');
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error('Error getting documents:', error);
  //     throw error;
  //   }
  // }
    
 


  // getProductOperationsById(productId: string): Observable<ProductOperationsModel[]> {
  //   let operations:Observable<ProductOperationsModel[]> = []; 
  //   try {
  //     this.firestore.collection('ProductChain').doc(productId).collection("updateMap").get().forEach(individualDoc=>{
  //       console.log("Updated Map size :"+individualDoc.size)
  //       individualDoc.forEach(doc=>{
  //         var recvDocData = JSON.parse(JSON.stringify(doc.data()));
  //         console.log("timeStamp: "+recvDocData["timeStamp"]);
  //         console.log("operation: "+recvDocData["operation"]);
  //         console.log("prevHash: "+recvDocData["prevHash"]);
  //         console.log("transID: "+recvDocData["transID"]);
  //         console.log("currentHash: "+recvDocData["currentHash"]);
  //         operations.push(new ProductOperationsModel(recvDocData["operation"],recvDocData["prevHash"],recvDocData["currentHash"],recvDocData["timeStamp"],recvDocData["transID"]));  
  //       });

  //     });
  //     // const snapshot = await this.firestore.collection('ProductChain').doc(productId).collection("updateMap").get().toPromise();
  //     // const updateMapData = snapshot.docs.map(doc => {
  //     //   const data = doc.data();
  //     //   const id = doc.id;
  //     //   return { id, ...data };
  //     // });
  //     return operations;
  //   } catch (error) {
  //     console.error("Error fetching updateMap data:", error);
  //     throw error;
  //   }
  // }

  getAllProducts(): Observable<any[]> {
    return this.firestore.collection('ProductChain').snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data();
            //const id = action.payload.doc.id;
            return data;
          });
        })
      );
  }

  getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key:string, value:any) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

}