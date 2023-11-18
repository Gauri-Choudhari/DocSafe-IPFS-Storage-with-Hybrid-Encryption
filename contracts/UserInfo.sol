// SPDX-License-Identifier: UNLICENSED
// user v1
pragma solidity ^0.8.0;

// Uncomment this line to use console.log
//import "hardhat/console.sol";

contract UserInfo {
    enum Role { None, Student, Faculty }

    struct Student {
        uint256 studentId;
        string name;
        string email;
        string phone;
        string dob;
        string yearofgrad;
        string institute;
        string city;
    }

    struct Faculty {
        uint256 facultyId;
        string name;
        string email;
        string phone;
        string position;
        string department;
        string institute;
        string city;
    }

    mapping(address => Student) public studentlist;
    mapping(address => Faculty) public facultylist;
    mapping(address => uint) public userRoles;

    uint256 public studentCount;
    uint256 public facultyCount;

    modifier onlyStudent() {
        require(userRoles[msg.sender] == uint(Role.Student), "Only students can call this function");
        _;
    }

    modifier onlyFaculty() {
        require(userRoles[msg.sender] == uint(Role.Faculty), "Only faculty can call this function");
        _;
    }

    function addUserRole(Role _role) internal {
        require(userRoles[msg.sender] == uint(Role.None), "User role already set");
        userRoles[msg.sender] = uint(_role);
    }

    function addStudent(
        uint256 _studentId,
        string memory _name,
        string memory _dob,
        string memory _email,
        string memory _phone,
        string memory _institute,
        string memory _city,
        string memory _yearofgrad
    ) public {
        require(studentlist[msg.sender].studentId == 0, "Student already exists");

        studentlist[msg.sender] = Student(
            _studentId,
            _name,
            _email,
            _phone,
            _dob,
            _yearofgrad,
            _institute,
            _city
        );
        addUserRole(Role.Student);
        studentCount++;
    }

    function addFaculty(
        uint256 _facultyId,
        string memory _name,
        string memory _email,
        string memory _phone,
        string memory _position,
        string memory _department,
        string memory _institute,
        string memory _city
    ) public {
        require(facultylist[msg.sender].facultyId == 0, "Faculty already exists");

        facultylist[msg.sender] = Faculty(
            _facultyId,
            _name,
            _email,
            _phone,
            _position,
            _department,
            _institute,
            _city
        );
        addUserRole(Role.Faculty);
        facultyCount++;
    }

    function updateStudent(
        uint256 _studentId,
        string memory _name,
        string memory _dob,
        string memory _email,
        string memory _phone,
        string memory _institute,
        string memory _city,
        string memory _yearofgrad
    ) public onlyStudent {
        require(studentlist[msg.sender].studentId != 0, "Student does not exist");

        studentlist[msg.sender] = Student(
            _studentId,
            _name,
            _email,
            _phone,
            _dob,
            _yearofgrad,
            _institute,
            _city
        );
    }

    function updateFaculty(
        uint256 _facultyId,
        string memory _name,
        string memory _email,
        string memory _phone,
        string memory _position,
        string memory _department,
        string memory _institute,
        string memory _city
    ) public onlyFaculty {
        require(facultylist[msg.sender].facultyId != 0, "Faculty does not exist");

        facultylist[msg.sender] = Faculty(
            _facultyId,
            _name,
            _email,
            _phone,
            _position,
            _department,
            _institute,
            _city
        );
    }

    function getUserRole() public view returns (string memory) {
        Role role = Role(userRoles[msg.sender]);
        if (role == Role.Student) {
            return "Student";
        } else if (role == Role.Faculty) {
            return "Faculty";
        } else {
            return "None";
        }
    }

    function getUserInfo() public view returns (uint256, string memory, string memory, string memory, string memory, string memory, string memory, string memory) {
        Role role = Role(userRoles[msg.sender]);
        if (role == Role.Student) {
            return getStudentInfo(msg.sender);
        } else if (role == Role.Faculty) {
            return getFacultyInfo(msg.sender);
        } else {
            revert("User not found");
        }
    }

    function getStudentInfo(address _publicKey) public view onlyStudent returns (uint256, string memory, string memory, string memory, string memory, string memory, string memory, string memory) {
        Student memory student = studentlist[_publicKey];
        return (
            student.studentId,
            student.name,
            student.email,
            student.phone,
            student.dob,
            student.yearofgrad,
            student.institute,
            student.city
        );
    }

    function getFacultyInfo(address _publicKey) public view onlyFaculty returns (uint256, string memory, string memory, string memory, string memory, string memory, string memory, string memory) {
        Faculty memory faculty = facultylist[_publicKey];
        return (
            faculty.facultyId,
            faculty.name,
            faculty.email,
            faculty.phone,
            faculty.institute,
            faculty.position,
            faculty.department,
            faculty.city
        );
    }
}
