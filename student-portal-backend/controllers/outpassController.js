// student-portal-backend/controllers/outpassController.js

// Ensure the Outpass model is required at the top
const Outpass = require('../models/Outpass');

// Submit a new outpass request
exports.createOutpass = async (req, res) => {
  // Log entry into the function with timestamp
  console.log(`ROUTE: /api/outpass/create - START - ${new Date().toISOString()}`);
  try {
    // Log the received text body and file info
    console.log("ROUTE: Received body:", req.body);
    console.log("ROUTE: Received file:", req.file); // This will be null if no file uploaded

    // Destructure data from the request body
    const { studentId, name, reason, fromDate, toDate } = req.body;
    // Get the file path from multer (if a file was uploaded)
    const imagePath = req.file ? req.file.path : null;

    // Basic validation for required text fields
    if (!studentId || !name || !reason || !fromDate || !toDate) {
        console.log("VALIDATION: Missing required fields");
        // Send a 400 Bad Request response if fields are missing
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Optional: Add validation for image presence if it's mandatory
    // if (!imagePath) {
    //     console.log("VALIDATION: Missing image file");
    //     return res.status(400).json({ message: 'Image file is required' });
    // } else {
    //     console.log(`VALIDATION: Image path found: ${imagePath}`);
    // }

    // Log before creating the Mongoose model instance
    console.log(`DB: Creating new Outpass instance... - ${new Date().toISOString()}`);
    const newOutpass = new Outpass({
      studentId,
      name,
      reason,
      fromDate, // Assuming these are valid Date strings or Date objects
      toDate,   // Mongoose will try to cast them
      image: imagePath, // Path from multer or null
      // status defaults to 'Pending' as per schema
    });
    // console.log("DB: Instance created:", newOutpass); // Optional: Log the full instance details if needed

    // Log right before attempting the database save operation
    console.log(`DB: Attempting to save outpass... - ${new Date().toISOString()}`);
    // Use await to wait for the save operation to complete
    await newOutpass.save(); // <-- Potential hang point
    // Log successful save operation with the new document ID
    console.log(`DB: Outpass saved successfully. ID: ${newOutpass._id} - ${new Date().toISOString()}`);

    // Log before sending the successful response back to the client
    console.log(`RESPONSE: Sending 201 response... - ${new Date().toISOString()}`);
    // Send a 201 Created status and the newly created outpass object
    res.status(201).json({ message: 'Outpass submitted successfully', outpass: newOutpass });
    // Log after the response has been sent (or at least handed off to the OS)
    console.log(`RESPONSE: Sent 201. - ${new Date().toISOString()}`);

  } catch (error) {
    // Log any error that occurs during the try block
    console.error(`ERROR in /api/outpass/create: ${error.message} - ${new Date().toISOString()}`, error.stack); // Log the full error stack
    // Send a 500 Internal Server Error response
    // Avoid sending the raw error message in production for security, but ok for debugging
    res.status(500).json({ message: 'Server error creating outpass', error: error.message });
  }
};

// Get all outpasses
exports.getAllOutpasses = async (req, res) => {
  console.log(`ROUTE: /api/outpass (GET) - START - ${new Date().toISOString()}`);
  try {
    console.log(`DB: Finding all outpasses... - ${new Date().toISOString()}`);
    const outpasses = await Outpass.find();
    console.log(`DB: Found ${outpasses.length} outpasses. - ${new Date().toISOString()}`);

    console.log(`RESPONSE: Sending 200 response... - ${new Date().toISOString()}`);
    res.status(200).json(outpasses); // Send 200 OK with the data
    console.log(`RESPONSE: Sent 200. - ${new Date().toISOString()}`);
  } catch (error) {
    console.error(`ERROR in /api/outpass (GET): ${error.message} - ${new Date().toISOString()}`, error.stack);
    res.status(500).json({ message: 'Server error fetching outpasses', error: error.message });
  }
};

// Update the status of an outpass
exports.updateOutpassStatus = async (req, res) => {
  // Use req.params.id for route parameters
  const { id } = req.params;
  console.log(`ROUTE: /api/outpass/${id} (PUT) - START - ${new Date().toISOString()}`);
  try {
    const { status } = req.body;
    console.log("ROUTE: Received body for update:", req.body);

    // Basic validation for the status field
    const allowedStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!status || !allowedStatuses.includes(status)) {
         console.log(`VALIDATION: Invalid status value received: ${status}`);
         return res.status(400).json({ message: `Invalid status value. Must be one of: ${allowedStatuses.join(', ')}` });
    }

    console.log(`DB: Attempting to update outpass ID: ${id} with status: ${status} - ${new Date().toISOString()}`);
    // Find by ID and update, { new: true } returns the updated document
    const updatedOutpass = await Outpass.findByIdAndUpdate(id, { status }, { new: true });

    // Check if an outpass was actually found and updated
    if (!updatedOutpass) {
        console.log(`DB: Outpass with ID: ${id} not found for update. - ${new Date().toISOString()}`);
        return res.status(404).json({ message: 'Outpass not found' });
    }

    console.log(`DB: Outpass ID: ${id} updated successfully. - ${new Date().toISOString()}`);
    console.log(`RESPONSE: Sending 200 response... - ${new Date().toISOString()}`);
    res.status(200).json({ message: 'Outpass status updated successfully', outpass: updatedOutpass }); // Send 200 OK
    console.log(`RESPONSE: Sent 200. - ${new Date().toISOString()}`);

  } catch (error) {
    console.error(`ERROR in /api/outpass/${id} (PUT): ${error.message} - ${new Date().toISOString()}`, error.stack);
    res.status(500).json({ message: 'Server error updating outpass status', error: error.message });
  }
};