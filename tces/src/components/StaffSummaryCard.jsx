const StaffSummaryCard = ({ staff, editable, onChange }) => {
    return (
      <div className="bg-white p-4 rounded shadow space-y-2">
        <div className="flex justify-between">
          {editable ? (
            <>
              <input
                type="text"
                name="fullName"
                value={`${staff.firstName} ${staff.lastName}`}
                onChange={onChange}
                className="text-lg font-bold w-full"
              />
              <input
                type="text"
                name="role"
                value={staff.role}
                onChange={onChange}
                className="text-sm text-gray-500 ml-4"
              />
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold">{staff.firstName} {staff.lastName}</h2>
              <p className="text-sm text-gray-500">{staff.role}</p>
            </>
          )}
        </div>
  
        <div className="flex justify-between text-sm">
          {editable ? (
            <>
              <input type="email" name="email" value={staff.email} onChange={onChange} />
              <input type="text" name="phone" value={staff.phone} onChange={onChange} />
            </>
          ) : (
            <>
              <p><strong>Email:</strong> {staff.email}</p>
              <p><strong>Phone:</strong> {staff.phone}</p>
            </>
          )}
        </div>
  
        <div className="text-sm">
          <strong>Address:</strong>{' '}
          {editable ? (
            <input type="text" name="address" value={staff.address} onChange={onChange} className="w-full" />
          ) : (
            staff.address
          )}
        </div>
  
        <div className="text-sm">
          <strong>NIN:</strong>{' '}
          {editable ? (
            <input type="text" name="nin" value={staff.nin} onChange={onChange} />
          ) : (
            staff.nin
          )}
        </div>
      </div>
    );
  };
  
  export default StaffSummaryCard;
  