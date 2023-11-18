import React, { useState, useContext, useEffect } from 'react';
import Web3 from 'web3';
import UserDep from '../contracts/UserDep.json';
import contract from '../contracts/contract-address.json';
import { UserContext } from '../contexts/UserContext';

const web3 = new Web3(window.ethereum);
const usercon = new web3.eth.Contract(UserDep.abi, contract.userdep);

const StudentProfile = () => {
  const { user, userRole } = useContext(UserContext);

  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    phone: '',
    dob: '',
    yearofgrad: '',
    institute: '',
    city: '',
  });

  const [isUserInfoPresent, setIsUserInfoPresent] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {

        console.log(userRole, "Fetching");
      
  
        try {
        const userInfo = await usercon.methods.getUserInfo().call({ from: user });
        if (userInfo[0] !== 0) {
          // User info is present, update the form data
          setFormData({
            studentId: userInfo[0].toString(),
            name: userInfo[1],
            email: userInfo[2],
            phone: userInfo[3],
            dob: userInfo[4],
            yearofgrad: userInfo[5],
            institute: userInfo[6],
            city: userInfo[7],
          });
          console.log(formData.studentId);
          setIsUserInfoPresent(true);
        }
      
      } catch (error) {
        console.error('Error fetching user info:', error.message);
      }
    
    };

    fetchUserInfo();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isUserInfoPresent) {
        // User info is present, update the existing information
        await usercon.methods
          .updateStudent(
            formData.studentId,
            formData.name,
            formData.dob,
            formData.email,
            formData.phone,
            formData.institute,
            formData.city,
            formData.yearofgrad
          )
          .send({ from: user });
      } else {
        try {
          const transaction = await usercon.methods
          .addStudent(
            formData.studentId,
            formData.name,
            formData.dob,
            formData.email,
            formData.phone,
            formData.institute,
            formData.city,
            formData.yearofgrad
          ).send({from: user, value: 0, gas: 5000000});
        console.log(transaction);
       } catch (error) {
          console.error('Error sending transaction:', error.message);
          // Handle the error, e.g., show an error message to the user
       }
        
        // await usercon.methods
        //   .addStudent(
        //     formData.studentId,
        //     formData.name,
        //     formData.dob,
        //     formData.email,
        //     formData.phone,
        //     formData.institute,
        //     formData.city,
        //     formData.yearofgrad
        //   )
        //   .send({ from: user });
        // await usercon.methods
        //   .addStudent(
        //     formData.studentId,
        //     formData.name,
        //     formData.dob,
        //     formData.email,
        //     formData.phone,
        //     formData.institute,
        //     formData.city,
        //     formData.yearofgrad
        //   )
        //   .send({ from: user });
      }

      // You can add further logic, such as redirecting the user or showing a success message
      alert('Student profile updated successfully!');
    } catch (error) {
      console.error('Error updating student profile:', error.message);
      // Handle the error, e.g., show an error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Student ID:
        <input
          type="text"
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
        />
      </label>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <label>
        Phone:
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </label>
      <label>
        Date of Birth:
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />
      </label>
      <label>
        Year of Graduation:
        <input
          type="text"
          name="yearofgrad"
          value={formData.yearofgrad}
          onChange={handleChange}
        />
      </label>
      <label>
        Institute:
        <input
          type="text"
          name="institute"
          value={formData.institute}
          onChange={handleChange}
        />
      </label>
      <label>
        City:
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default StudentProfile;