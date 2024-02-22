import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import { prettyDate } from "@/lib/date";
import { Axios } from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Admins() {
  const [email, setEmail] = useState("");
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  async function addAdmin(e) {
    e.preventDefault();

    if (email === "")
      return Swal.fire({
        title: `Email is required!`,
        icon: "error",
      });

    await Axios("/api/admins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }).then((res) => {
      console.log(res);
      Swal.fire({
        title: `Admin created!`,
        icon: "success",
      })
      setEmail("");
      loadAdmins();
    }).catch((err) => {
        console.log(err)
        Swal.fire({
            title: `$Error!`,
            text: `${err.response.data.message}`,
            icon: "error",
          })
    }
    );
  }

  async function loadAdmins() {
    setLoading(true);
    await fetch("/api/admins")
      .then((res) => res?.json())
      .then((data) => {
        setAdmins(data);
        setLoading(false);
      });
  }


  function deleteEamil(str, email) {
    Swal.fire({
      title: `Do you want to delete this ${email}?`,
      showDenyButton: true,
      confirmButtonText: "Yes, Delete!",
      denyButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#d55",
      denyButtonColor: "#808080",
    }).then(async (result) => {
      if (result.isConfirmed) {
        fetch("/api/admins?_id=" + str, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }).then(res => loadAdmins())
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  return (
    <Layout>
      <span>Admins</span>

      <form className="mt-4" onSubmit={addAdmin}>
        <label className="mt-2 mb-2 text-lg font-">Add new Admin</label>
        <div className="flex gap-2">
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="text"
            placeholder="Enter admin email"
          />
          <button className="btn-primary whitespace-nowrap" type="submit">
            add Admin
          </button>
        </div>
      </form>
      <table className="basic mt-10">
        <thead>
          <tr>
            <th className="text-left">Admin google email</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>{loading && <Spinner fullWidth={true} />}</tr>
          {admins?.length > 0 &&
            !loading &&
            admins?.map((admin, index) => (
              <tr key={index}>
                <td>{admin.email}</td>
                <td>{admin.createdAt && prettyDate(admin?.createdAt)}</td>
                <td className="flex gap-2">
                <button
                    className="btn-default"
                    onClick={() => deleteEamil(admin?._id, admin?.email)}
                  >
                    verify
                  </button>
                  <button
                    className="btn-red"
                    onClick={() => deleteEamil(admin?._id, admin?.email)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
