import { Component } from '@angular/core';
import { FormGroup, FormControl,Validators, ReactiveFormsModule } from '@angular/forms';
import { EmployeeModel } from './model/Employee';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // protected readonly title = signal('angular_crud');
  employeeForm!: FormGroup;
  employeeObj = new EmployeeModel();
  employeeList: EmployeeModel[]=[];
  isEditMode= false; //in order to prevent 

  //creation of constructor
  constructor(){
    this.createForm();
    //debugger;
    const oldData = localStorage.getItem('employeeData');
    if(oldData != null){
      const parseData = JSON.parse(oldData);
      this.employeeList = parseData;
    }
  }
  onReset(){
    this.employeeObj = new EmployeeModel();
    this.createForm();
    this.isEditMode = false; //reset to add mode 
  }

  //creation of method 
  createForm(){
  this.employeeForm = new FormGroup({
    empId: new FormControl(this.employeeObj.empId ),
    name: new FormControl(this.employeeObj.name,[Validators.required]),
    city: new FormControl(this.employeeObj.city ),
    state: new FormControl(this.employeeObj.state ),
    emailId: new FormControl(this.employeeObj.emailId ),
    contactNo: new FormControl(this.employeeObj.contactNo ),
    address: new FormControl(this.employeeObj.address ),
    pinCode: new FormControl(this.employeeObj.pinCode, [Validators.required, Validators.minLength(6)] ),
  })
}
  onSave(){
    //debugger;
    if(!this.employeeForm.valid){
      alert("Please fill all required fields");
      return;
    }
    const oldData = localStorage.getItem('employeeData');
    if(oldData != null){
      const parseData = JSON.parse(oldData);
      this.employeeForm.controls['empId'].setValue(parseData.length + 1);
      this.employeeList = parseData; //getting old data
      this.employeeList.unshift(this.employeeForm.value);
    }else{
      this.employeeForm.controls['empId'].setValue(1); //add id for 1st employee
      this.employeeList.unshift(this.employeeForm.value);
    }
    localStorage.setItem('employeeData', JSON.stringify(this.employeeList));
    this.onReset();
  }
  onEdit(item: EmployeeModel){
    this.employeeObj = item;
    this.isEditMode = true; //enter edit mode and prevent duplication
    this.createForm();
  }
  onUpdate(){
    if(!this.employeeForm.valid){
      alert("Please fill all required fields before updating");
      return;
    }
    const record = this.employeeList.find(m=>m.empId == this.employeeForm.controls['empId'].value);
    if(record != undefined){
      record.name = this.employeeForm.controls['name'].value;
      record.city = this.employeeForm.controls['city'].value;
      record.state = this.employeeForm.controls['state'].value;
      record.emailId = this.employeeForm.controls['emailId'].value;
      record.contactNo = this.employeeForm.controls['contactNo'].value;
      record.address = this.employeeForm.controls['address'].value;
      record.pinCode = this.employeeForm.controls['pinCode'].value;
    }
    localStorage.setItem('employeeData', JSON.stringify(this.employeeList));
    this.onReset();
  }
  onDelete(id:number){
    const isDelete = confirm("Are you sure to delete this record?");
    if(isDelete){
      const index = this.employeeList.findIndex(m=>m.empId == id);
      this.employeeList.splice(index,1);
      localStorage.setItem('employeeData', JSON.stringify(this.employeeList));
    }
  }
}
