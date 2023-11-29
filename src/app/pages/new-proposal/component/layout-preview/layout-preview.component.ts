// Almost working code for drawing rooms
import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ProposalService } from "src/app/service/proposal/proposal.service";
import { LocationService } from "src/app/service/location/location.service";
import Konva from "konva";
import { environment } from "src/environments/environment";

export interface DialogData {
    locationId: string,
    proposalId:string,
    totalNoOfSeat:number,
    content:any;
}

@Component({
    selector: 'new-proposal-layout-preview',
    templateUrl: './layout-preview.component.html',
    styleUrls: ['./layout-preview.component.scss']
})
export class NewProposalLayoutPreviewComponent implements OnInit {
    id!: string;
    imageUrl:any;
    flowOfDrawingSeats:boolean=true;
    stage!: Konva.Stage;
    layer!: Konva.Layer;
    line!: Konva.Line;
    customWidth = 1080;
    customHeight = 734;
    backgroundImage!: Konva.Image;
    transformer!: Konva.Transformer;
    getAllPoints:any[]=[]
    totalNumber!:number;
  seatWidth!: number;
  seatHeight!: number;
  content:any;
    constructor(
        public dialogRef: MatDialogRef<NewProposalLayoutPreviewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private proposalService: ProposalService,
        private locationService:LocationService
    ) { }
    
    minThreshold:any;
    maxThreshold:any;
    ngOnInit(): void {
        this.totalNumber=this.data.totalNoOfSeat;
        this.displayTotal=this.totalNumber;
        this.minThreshold=this.displayTotal-(5/100) *this.displayTotal
        this.maxThreshold=this.displayTotal-(10/100) *this.displayTotal
        console.log(this.minThreshold,this.maxThreshold)
        this.content=this.data.content;
        this.proposalService.generateLayout(this.data.proposalId).subscribe((res:any)=>{
              this.getImageAndInitialize(res.locationId,res.layoutArray)
        })

    }
    initializeKonva(imageObj: HTMLImageElement): void {
        this.stage = new Konva.Stage({
          container: 'container',
          width: this.customWidth,
          height: this.customHeight,
        });

        this.layer = new Konva.Layer({
          name: 'firstLayer',
        });
        this.stage.add(this.layer);

        this.backgroundImage = new Konva.Image({
          image: imageObj,
          width: this.customWidth,
          height: this.customHeight,
        });

        this.layer.add(this.backgroundImage);
        this.layer.draw();

      }
//intialize the image and stage and layer
layoutData:any[]=[]
      getImageAndInitialize(locationId:any,layoutArray:any){
        this.seatWidth=layoutArray[0].seatWidth;
        this.seatHeight=layoutArray[0].seatHeight;
        this.locationService.getImageById(locationId).subscribe(
            (imageUrl) => {
              this.imageUrl = environment.baseUrl+'images/' + imageUrl;
              // this.proposalService.getProposalByLocationId(locationId).subscribe(
              //   (result:any)=>{
              //     if(result.Message=='No Data'){
              const imageObj = new Image();
              imageObj.onload = () => {
                this.initializeKonva(imageObj);
  
               
                this.layoutData=layoutArray[0].layoutBorder
                this.layoutData.sort((a:any,b:any)=>a.sequenceNo-b.sequenceNo)
                this.drawSeatsInRectangle()
              };
              imageObj.src = this.imageUrl;
              imageObj.crossOrigin = 'Anonymous';
      
            },
            error => {
              console.error('Error loading image data:', error);
            }
          );
        // });
      }
      //drawSeats
      drawingEnabled: boolean = true;

      saveImage(){
        const image=this.stage.toDataURL()
        let data={
          image:String(image),
          drawnSeats:this.drawnSeats,
          // drawnSeats:this.drawnRooms,
          seatSize:[{
           height: this.seatHeight,
           width:this.seatWidth
          }]
        }
        this.proposalService.saveImage(this.data.proposalId,data).subscribe(res=>{
          this.dialogRef.close(true)
              // console.log(res)
            })
      }

      drawnRooms: any[] = [];
      displayTotal!:number;
      lastCoordinate:any[]=[]
      drawnSeats:any[]=[]
   
      drawSeatsInRectangle() {
        this.layoutData.forEach(point=>{
          console.log("CALLED++++>>>>>")
       let count = 0;
       if (!this.stage || !this.layer) return;
       if (this.drawingEnabled === true) {
         let remainingSeats = this.totalNumber;
           const minX = point.startX;
           const minY = point.startY;
           const maxX = point.endX;
           const maxY = point.endY;


           const availableWidth = maxX - minX;
           const availableHeight = maxY - minY;
           const maxHorizontalRectangles = Math.round(availableWidth / this.seatWidth);
           const maxVerticalRectangles = Math.round(availableHeight / this.seatHeight);

           const maxRectangles = maxHorizontalRectangles * maxVerticalRectangles;

             const columns = Math.min(Math.ceil(remainingSeats / maxVerticalRectangles), maxHorizontalRectangles);
           const seatWidth = point.seatPosition ? this.seatWidth : this.seatHeight; 
               const seatHeight = point.seatPosition ? this.seatHeight :this.seatWidth;
             for (let column = 0; column < columns; column++) {
               for (let y = minY; y < maxY-10  ; y += seatHeight) {
                 const x = minX + column * seatWidth;
                 console.log(seatHeight,seatWidth)
                   this.drawSeatRectangle(x, y,seatHeight,seatWidth);
                   this.drawnSeats.push({ start: { x: x, y: y }, end: { x: x + seatWidth, y: y + seatHeight },workStatkionID: point._id,seatPosition:point.seatPosition });
                   remainingSeats--;
                   count++;
                   if(count==this.totalNumber){
                    break
                   }
               }
             }
      
           this.totalNumber=remainingSeats;
         this.layer.batchDraw();
       }
        })
     }


      drawSeatRectangle(x:number, y:number,height:number,width:number) {
        const rect = new Konva.Rect({
          x: x,
          y: y,
          width: width,
          height: height,
          fill: 'blue',
          opacity: 0.3,
          stroke: 'red',
          strokeWidth: 0.4,
          name: 'seat-rectangle',
        });
        this.layer.add(rect);
        rect.cache() //for code optimization
      }

}
