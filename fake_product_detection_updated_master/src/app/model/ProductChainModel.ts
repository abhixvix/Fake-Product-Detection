
export class ProductChainModel {
  
  nonce:number = 0;
  productTitle = "";
  productId = "";
  operationText = "";
  prevHash= "";
  hash = "";
  timeStamp = "";
  qrString = "";
  scanCount:number = 0;

  constructor(
    nonce: number,
    productTitle: string,
    productId: string,
    operationText: string,
    prevHash: string,
    hash: string,
    timeStamp: string,
    qrString:string,
    scanCount:number
  ) {
    this.nonce = nonce;
    this.productTitle = productTitle;
    this.productId = productId;
    this.operationText = operationText;
    this.prevHash = prevHash;
    this.hash = hash;
    this.timeStamp = timeStamp;
    this.qrString = qrString;
    this.scanCount = scanCount;
  }
  

}