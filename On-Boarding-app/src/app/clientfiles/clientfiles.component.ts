import { Component } from '@angular/core';
import { cmisService } from './cmis.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environments';

@Component({
  selector: 'app-clientfiles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clientfiles.component.html',
  styleUrl: './clientfiles.component.scss'
})
export class ClientfilesComponent {
   parentfolder: any[] = [];
   apiUrl : any =environment.apiBaseUrl ;

  constructor(private cmisService: cmisService) {}

  ngOnInit() {
    this.cmisService.getFolderFiles().subscribe(files => {
       this.parentfolder = files;
      console.log(files);
    });
  }

 

}
