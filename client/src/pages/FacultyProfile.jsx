import React, { useState, useContext, useEffect } from 'react';
import Web3 from 'web3';
import UserDep from '../contracts/UserDep.json';
import contract from '../contracts/contract-address.json';
import { UserContext } from '../contexts/UserContext';

const web3 = new Web3(window.ethereum);
const usercon = new web3.eth.Contract(UserDep.abi, contract.userdep);

const FacultyProfile = () => {
  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState({
    facultyId: '',
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    institute: '',
    city: '',
  });

  const [isUserInfoPresent, setIsUserInfoPresent] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await usercon.methods.getUserInfo().call({ from: user });
        console.log(userInfo);
        if (userInfo[0] !== 0) {
          // User info is present, update the form data
          setFormData({
            facultyId: userInfo[0].toString(),
            name: userInfo[1],
            email: userInfo[2],
            phone: userInfo[3],
            position: userInfo[4],
            department: userInfo[5],
            institute: userInfo[6],
            city: userInfo[7],
          });
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
          .updateFaculty(
            "123",
            formData.name,
            formData.email,
            formData.phone,
            formData.position,
            formData.department,
            formData.institute,
            formData.city
          )
          .send({from: user, value: 0});
      } else {
        // User info is not present, add new information
        try{ const transaction = await usercon.methods
          .addFaculty(
            formData.facultyId,
            formData.name,
            formData.email,
            formData.phone,
            formData.position,
            formData.department,
            formData.institute,
            formData.city
          )
          .send({from: user, value: 0});
          console.log(transaction);
        } catch (error) {
           console.error('Error sending transaction:', error.message);
           // Handle the error, e.g., show an error message to the user
        }
         
      }

      // You can add further logic, such as redirecting the user or showing a success message
      alert('Faculty profile updated successfully!');
    } catch (error) {
      console.error('Error updating faculty profile:', error.message);
      // Handle the error, e.g., show an error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Faculty ID:
        <input
          type="number"
          name="facultyId"
          value={formData.facultyId}
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
        Position:
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
        />
      </label>
      <label>
        Department:
        <input
          type="text"
          name="department"
          value={formData.department}
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

export default FacultyProfile;
