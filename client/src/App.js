import { useState, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import dayjs, { Dayjs } from 'dayjs';
import { TextField, Button, Container, Stack, Date, TextareaAutosize, Select, MenuItem, InputLabel } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import SignatureCanvas from 'react-signature-canvas'


const LoadingScreen = () => {
  return (
    <div>
      <h1>Loading...</h1>
    </div>
  )
}

const SubmittedScreen = () => {
  return (
    <div>
      <h1>Form Submitted</h1>
    </div>
  )
}


const handleEmployeeChange = (e, id, employees, setFormData) => {
  e.preventDefault();
  const { name, value } = e.target;
  const newEmployees = employees.map((employee) => {
    if (employee.id === id) {
      return {
        ...employee,
        [name]: value,
      };
    }
    return employee;
  });
  setFormData((prevFormData) => ({
    ...prevFormData,
    employees: newEmployees,
  }));
};

const handleEmployeeTimeChange = (time, id, column, employees, setFormData) => {
  //convert time to string of form HH:MM AM/PM
  time = time.format('hh:mm A');
  const newEmployees = employees.map((employee) => {
    if (employee.id === id) {
      return {
        ...employee,
        [column]: time,
      };
    }
    return employee;
  });
  setFormData((prevFormData) => ({
    ...prevFormData,
    employees: newEmployees,
  }));
}

const handleEquipmentChange = (e, id, equipment, setFormData) => {
  e.preventDefault();
  const { name, value } = e.target;
  const newEquipment = equipment.map((equipment) => {
    if (equipment.id === id) {
      return {
        ...equipment,
        [name]: value,
      };
    }
    return equipment;
  });
  setFormData((prevFormData) => ({
    ...prevFormData,
    equipment: newEquipment,
  }));
}

const CustomTableCellText = ({ id, column, employees, setFormData, size }) => {
  const width = size === 'small' ? '50px' : '200px'
  const employee = employees.find((employee) => employee.id === id);
  return (
    <TableCell>
      <TextField
        type="text"
        variant="outlined"
        color="secondary"
        name={column}
        value={employee[column]}
        onChange={(e) => handleEmployeeChange(e, employee.id, employees, setFormData)}
        fullWidth
        style={{ width }}
      />
    </TableCell>
  );
};

const CustomTableCellTime = ({ id, column, employees, setFormData }) => {
  const employee = employees.find((employee) => employee.id === id);
  return (
    <TableCell>
      {/* <TextField
        type="time"
        vairant="outlined"
        color="secondary"
        name={column}
        value={employee[column]}
        onChange={(e) => handleEmployeeChange(e, employee.id, employees, setFormData)}
        fullWidth
        style={{ width: '135px' }}
      /> */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="time"
          value={employee[column]}
          color="secondary"
          onChange={(e) => handleEmployeeTimeChange(e, employee.id, column, employees, setFormData)}
          slotProps={{
            textField: {
              error: false,
              // make wider
              style: { width: '130px' }
            },
          }}
          // disable all minutes except 00, 15, 30, 45
          minutesStep={15}


          // renderInput={(params) => (
          //   <TextField
          //     {...params}
          //     variant="outlined"
          //     fullWidth
          //     style={{ width: '135px' }}
          //   />
          // )}
        />
      </LocalizationProvider>
    </TableCell>
  )
}

const addEmployee = (employees, setFormData) => {
  const newEmployees = [...employees];
  newEmployees.push({
    id: employees.length,
    name: "",
    startTime: "",
    endTime: "",
    flaggerInitials: "",
    clientInitials: "",
  });
  setFormData((prevFormData) => ({
    ...prevFormData,
    employees: newEmployees,
  }));
}

const removeEmployee = (employees, setFormData) => {
  const newEmployees = [...employees];
  newEmployees.pop();
  setFormData((prevFormData) => ({
    ...prevFormData,
    employees: newEmployees,
  }));
}

const addEquipment = (equipment, setFormData) => {
  const newEquipment = [...equipment];
  newEquipment.push({
    id: equipment.length,
    equipment: "",
    qty: "",
    dailyWeekly: "",
  });
  setFormData((prevFormData) => ({
    ...prevFormData,
    equipment: newEquipment,
  }));
}

const removeEquipment = (equipment, setFormData) => {
  if (equipment.length === 1) return;
  const newEquipment = [...equipment];
  newEquipment.pop();
  setFormData((prevFormData) => ({
    ...prevFormData,
    equipment: newEquipment,
  }));
}


const EmployeeTable = ({employees, setFormData}) => {
  return (
    <>
      <Table className="table">
        {/* <caption>Employee Information</caption> */}
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell>Flagger Initials</TableCell>
            <TableCell>Client Initials</TableCell>
          </TableRow>
          {/* for each employee in employees create a row */}
          {employees.map((employee) => (
            <TableRow>
              <CustomTableCellText id={employee.id} column="name" employees={employees} setFormData={setFormData} />
              <CustomTableCellTime id={employee.id} column="startTime" employees={employees} setFormData={setFormData} />
              <CustomTableCellTime id={employee.id} column="endTime" employees={employees} setFormData={setFormData} />
              <CustomTableCellText id={employee.id} column="flaggerInitials" employees={employees} setFormData={setFormData} size="small" />
              <CustomTableCellText id={employee.id} column="clientInitials" employees={employees} setFormData={setFormData} size="small" />
            </TableRow>
          ))}
        </TableHead>
      </Table>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={() => addEmployee(employees, setFormData)}>Add Employee</Button>
        <Button onClick={() => removeEmployee(employees, setFormData)} style={{ marginLeft: '10px' }}>Remove Employee</Button>
      </div>
    </>
  )
}

const EquipmentRow = ({ equipment, allEquipment, setFormData }) => {
  return (
    <div class="content" style={{padding: "10px"}}>
      {/* <TextField
        type="text"
        vairant="outlined"
        color="secondary"
        label="EQUIPMENT NAME"
        name="equipment"
        value={equipment.equipment}
        onChange={(e) => handleEquipmentChange(e, equipment.id, allEquipment, setFormData)}
        fullWidth
      /> */}
      <TextField
        value={equipment.equipment}
        onChange={(e) => handleEquipmentChange(e, equipment.id, allEquipment, setFormData)}
        select
        label="EQUIPMENT NAME"
        inputProps={
          {
            name: 'equipment',
            id: 'equipment'
          }
        }
        className='dropdown'
      >
        <MenuItem value={'Arrow Board'}>Arrow Board</MenuItem>
        <MenuItem value={'Light Tower'}>Light Tower</MenuItem>
        <MenuItem value={'AFAD'}>AFAD</MenuItem>
        <MenuItem value={'Other'}>Other</MenuItem>
      </TextField>
      {equipment.equipment === 'Other' && <TextField
        type="text"
        vairant="outlined"
        color="secondary"
        label="Other Equipment"
        name="otherEquipment"
        value={equipment.otherEquipment}
        onChange={(e) => handleEquipmentChange(e, equipment.id, allEquipment, setFormData)}
        fullWidth
      />}
      <TextField
        value={equipment.qty}
        onChange={(e) => handleEquipmentChange(e, equipment.id, allEquipment, setFormData)}
        select
        label="QTY"
        inputProps={
          {
            name: 'qty',
            id: 'qty'
          }
        }
        className='dropdown'
      >
        <MenuItem value={1}>1</MenuItem>
        <MenuItem value={2}>2</MenuItem>
        <MenuItem value={3}>3</MenuItem>
        <MenuItem value={4}>4</MenuItem>
      </TextField>
      {/* <TextField
              type="text"
              vairant="outlined"
              color="secondary"
              label="DAILY/WKLY"
              name="dailyWeekly"
              value={formData.dailyWeekly}
              onChange={handleInputChange}
              fullWidth
            /> */}
      <TextField
        value={equipment.dailyWeekly}
        onChange={(e) => handleEquipmentChange(e, equipment.id, allEquipment, setFormData)}
        select
        label="DAILY/WKLY"
        inputProps={
          {
            name: 'dailyWeekly',
            id: 'dailyWeekly'
          }
        }
        className='dropdown'
      >
        <MenuItem value={'Daily'}>Daily</MenuItem>
        <MenuItem value={'Weekly'}>Weekly</MenuItem>
      </TextField>
    </div>
  )
}

const App = () => {
  const clientSig = useRef();
  const supervisorSig = useRef();
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    teamLead: "",
    teamLeadNumber: "",
    streetAddress: "",
    cityAddress: "",
    date: "",
    day: "",
    license: "",
    job: "",
    maximo: "",
    clientCompany: "",
    otherClientCompany: "",
    equipment: [
      {
        id: 0,
        equipment: "",
        qty: "",
        dailyWeekly: "",
      }
    ],
    qty: "",
    dailyWeekly: "",
    employees: [
      {
        id: 0,
        name: "",
        startTime: "",
        endTime: "",
        flaggerInitials: "",
        clientInitials: "",
      },
      {
        id: 1,
        name: "",
        startTime: "",
        endTime: "",
        flaggerInitials: "",
        clientInitials: "",
      },
      {
        id: 2,
        name: "",
        startTime: "",
        endTime: "",
        flaggerInitials: "",
        clientInitials: "",
      }
    ],
    comment: "",
    clientName: "",
    supervisorName: "",
    clientSignature: null,
    supervisorSignature: null,
  });

  // const

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    // console.log(JSON.stringify(formData));
    // update state to have date be of the form MM-DD-YYYY
    const date = formData.date;
    const formattedDate = dayjs(date).format('MM-DD-YYYY');
    setFormData((prevFormData) => ({
      ...prevFormData,
      date: formattedDate,
    }));
    // determine day from date
    const day = dayjs(date).format('dddd');
    setFormData((prevFormData) => ({
      ...prevFormData,
      day,
    }));

    // send to local api at port 3001
    // fetch('https://7ctna56fk6.execute-api.us-east-1.amazonaws.com/prod/', {
    fetch('https://7ctna56fk6.execute-api.us-east-1.amazonaws.com/prod/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false)
        setSubmitted(true)
      })
  };

  const handleSignatureEnd = (sigRef) => {
    const key = sigRef === clientSig ? 'clientSignature' : 'supervisorSignature'
    return () => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [key]: sigRef.current.toDataURL()
      }))
    }
  }

  return (
    loading ? <LoadingScreen /> : submitted ? <SubmittedScreen /> :
    <form onSubmit={handleSubmit}>
      <header>
        {/* <img src="logo.png" alt="My logo" class="logo" />
        <div class="team-lead"></div> */}
      </header>
      <main>
        {/* <div class="title">
          <h1>FLAGGING BILLING/INFORMATION SHEET</h1>
          <h3>*Please complete <i>ALL JOB</i> INFO</h3>
        </div> */}
        <div class="client-company">
        <TextField
            value={formData.clientCompany}
            onChange={handleInputChange}
            select
            label="Client Company"
            inputProps={
              {
                name: 'clientCompany',
                id: 'clientCompany'
              }
            }
            className='dropdown'
            required
          >
            <MenuItem value={'S.E.C.'}>S.E.C.</MenuItem>
            <MenuItem value={'Piedmont-Duke Energy'}>Piedmont-Duke Energy</MenuItem>
            <MenuItem value={'UCLS'}>UCLS</MenuItem>
            <MenuItem value={'Other'}>Other</MenuItem>
          </TextField>
          {formData.clientCompany === 'Other' && <TextField
            type="text"
            vairant="outlined"
            color="secondary"
            label="Other Client Company"
            name="otherClientCompany"
            value={formData.otherClientCompany}
            onChange={handleInputChange}
            required
          />}
        </div>
        <section className='team-lead'>
          <TextField
            type="text"
            vairant="outlined"
            color="secondary"
            label="Team Lead"
            name="teamLead"
            value={formData.teamLead}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <TextField
            type="text"
            vairant="outlined"
            color="secondary"
            label="Team Lead Phone Number"
            name="teamLeadNumber"
            value={formData.teamLeadNumber}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </section>
        <section class="sec">
          {/* <h3 class="section-title">S.E.C.</h3> */}
          <Stack spacing={2} direction="row" sx={{marginBottom: 4}}>
            <TextField
              type="text"
              vairant="outlined"
              color="secondary"
              label="Street Address"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              type="text"
              vairant="outlined"
              color="secondary"
              label="City"
              name="cityAddress"
              value={formData.cityAddress}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Stack>
          <Stack spacing={2} direction="row" sx={{marginBottom: 4}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date Work Performed"
                value={formData.date}
                onChange={(newValue) => {
                  // convert newValue to string of form MM-DD-YYYY
                  newValue = newValue.format('MM-DD-YYYY');
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    date: newValue,
                  }));
                }
                }
                slotProps={{
                  textField: {
                    // size: "small",
                    error: false,
                  },
                }}
                // color="secondary"
              />
            </LocalizationProvider>
            {/* <label for="day">Day Work Performed:</label>
            <input type="text" id="day" name="day" required /><br /> */}
            <TextField
              type="text"
              vairant="outlined"
              color="secondary"
              label="Vehicle #"
              name="license"
              value={formData.license}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Stack>
          <Stack spacing={2} direction="row" sx={{marginBottom: 4}}>
            <TextField
              type="text"
              vairant="outlined"
              color="secondary"
              label="Job #"
              name="job"
              value={formData.job}
              onChange={handleInputChange}
              fullWidth
              required
            />

            <TextField
              type="text"
              vairant="outlined"
              color="secondary"
              label="Maximo #"
              name="maximo"
              value={formData.maximo}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Stack>
        </section>
        <section class="equipment">
          <h3 class="section-title">ADDITIONAL EQUIPMENT NEEDED</h3>
          {formData.equipment.map((equipment) => (
            <EquipmentRow equipment={equipment} allEquipment={formData.equipment} setFormData={setFormData}/>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={() => addEquipment(formData.equipment, setFormData)}>Add Equipment</Button>
            <Button onClick={() => removeEquipment(formData.equipment, setFormData)} style={{ marginLeft: '10px' }}>Remove Equipment</Button>
          </div>
        </section>
        <section class="employees">
          <EmployeeTable employees={formData.employees} setFormData={setFormData}/>
        </section>
        <section class="comments">
          <p>Comment(s):</p>
          <TextareaAutosize
            minRows={3}
            placeholder="Enter your comment here"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            style={{ width: "100%" }}
          />
        </section>
        <p id='notice'><b>**By signing below, you are agreeing to the above billing hours. Contact your immediate supervisor with any concerns.**</b></p>
        <section className="signatures">
          <div id="client">
            <TextField
              className="footerName"
              type="text"
              vairant="outlined"
              color="secondary"
              label="Foreman/Client Name"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <SignatureCanvas
              penColor='black'
              canvasProps={{ width: 350, height: 100, className: 'sigCanvas' }}
              ref={clientSig}
              onEnd={handleSignatureEnd(clientSig)}
            />
            <Button onClick={() => clientSig.current.clear()}>Clear Signature</Button>
          </div>
          <div id='supervisor'>
            <TextField
              className="footerName"
              type="text"
              vairant="outlined"
              color="secondary"
              label="Supervisor Name"
              name="supervisorName"
              value={formData.supervisorName}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <SignatureCanvas
              penColor='black'
              canvasProps={{ width: 350, height: 100, className: 'sigCanvas' }}
              ref={supervisorSig}
              onEnd={handleSignatureEnd(supervisorSig)}
            />
            <Button onClick={() => supervisorSig.current.clear()}>Clear Signature</Button>
          </div>
        </section>
        <section className="submit">
          <Button type="submit" variant="contained" color="primary">Submit Billing Sheet</Button>
        </section>
        {/* <img src="https://site-signatures.s3.amazonaws.com/clientSignature-1706470395478.png" width={125} height={50} /> */}
      </main>
    </form>
  );
}

export default App;
