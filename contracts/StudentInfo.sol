// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
//import "hardhat/console.sol";

contract StudentInfo {
    struct Student {
        address publicKey;
        uint studentId;
        string name;
        string email;
        string phone;
        string class;
        uint rollno;
    }

    mapping(address => Student) public students;
    uint public studentCount;

    function addStudent(uint _studentId, string memory _name, string memory _email, string memory _phone, string memory _class, uint _rollno) public {
        students[msg.sender] = Student(msg.sender, _studentId, _name, _email, _phone, _class, _rollno);
        studentCount++;
    }

    function getStudent(address _publicKey) public view returns (uint, string memory, string memory, string memory, string memory, uint) {
        Student memory student = students[_publicKey];
        return (student.studentId, student.name, student.email, student.phone, student.class, student.rollno);
    }

    function updateStudent(uint _studentId, string memory _newName, string memory _newEmail, string memory _newPhone, string memory _newClass, uint _newRollno) public {
        require(students[msg.sender].studentId != 0, "Student not found");
        students[msg.sender].studentId = _studentId;
        students[msg.sender].name = _newName;
        students[msg.sender].email = _newEmail;
        students[msg.sender].phone = _newPhone;
        students[msg.sender].class = _newClass;
        students[msg.sender].rollno = _newRollno;
    }
}