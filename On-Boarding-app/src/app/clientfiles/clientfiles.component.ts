import { Component } from '@angular/core';
import { cmisService } from './cmis.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clientfiles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clientfiles.component.html',
  styleUrl: './clientfiles.component.scss'
})
export class ClientfilesComponent {
   parentfolder: any[] = [];
  

  constructor(private cmisService: cmisService) {}

  ngOnInit() {
    this.cmisService.getFolderFiles().subscribe(files => {
      this.parentfolder = files;
      console.log(files);
    });
  }

 

}
