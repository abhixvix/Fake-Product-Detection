
export class ProductOperationsModel {
  
  operation = "";
  prevHash= "";
  currentHash = "";
  timeStamp = "";
  transID = "";
  constructor(
    operation: string,
    prevHash: string,
    currentHash: string,
    timeStamp: string,
    transId: string
  ) {
    this.operation = operation;
    this.prevHash = prevHash;
    this.currentHash = currentHash;
    this.timeStamp = timeStamp;
    this.transID = transId;
  }
  

}

// export interface ProductOperationsModel {
//   operation: string,
//   prevHash: string,
//   currentHash: string,
//   timeStamp: string,
//   transId: string
// }