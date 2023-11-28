// $.noConflict();
// jQuery(document).ready(function ($) {
//   var addFBtn = $(".addNewFolder");
//   var input = $(".newfolderINP");
//   // add folder
//   addFBtn.click(function () {
//     $(".fa-plus").addClass(" anim");
//     $.ajax({
//       type: "post",
//       url: "/folder",
//       data: {folderName: input.val() },
//       success: (response) => {
//           $(".folderList").append(
//             '<a href="?folderId=' +
//               response +
//               '"><li class="folder"><i class="fa fa-folder"> ' +
//               input.val() +
//               '</i><a onclick="return confirm(`Are you sure to delete ' +
//               input.val() +
//               ' folder ?`)" class="trash"href="?deleteFolderId=' +
//               response +
//               '"><i class="fas fa-trash"></i></a></li></a>'
//           );
//         $(".fa-plus").removeClass(" anim");
//       },
//       error: (response) => {
//         console.log(response);
//       },
//     });
//   });
//   // add folder

//   // add new tasks
//   $(".addTaskInp").keypress(function (e) {
//     if (e.which === 13) {

//       $.ajax({
//         type: "post",
//         url: "process/ajax_handler.php",
//         data: {
//           action: "addTask",
//           taskName: $(this).val(),
//           folderId: $(".php-activeFold").attr("data-activeFolder"),
//         },
//           success: function (response) {
//             if (response == 0) {
//               alert("your task has no name !");
//               // Swal.fire({
//               //   title: 'Error!',
//               //   allowEnterKey:false,
//               //   text: 'the folder name should have at least 3 letters!!',
//               //   icon: 'error',
//               //   confirmButtonText: 'Cool'
//               // })
//             }

//             location.reload()
//         },
//         error: (response) => {
//           console.log(response);
//         },
//       });
//     }
//   });
//   // add new tasks

// });

// console.log(folderCreationResult);

// add new folder
document.querySelector('.addNewFolder').addEventListener('click', async () => {
  const folderInput = document.querySelector('.newfolderINP');
  const newFolder = {
    name: folderInput.value,
  };
  const folderCreationResult = await fetch('/folder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newFolder),
  });
  const newFolderInfo = await folderCreationResult.json();
  document.querySelector('.folderList').insertAdjacentHTML(
    'beforeend',
    `
      <a id="folderWrapp"  href="?folderId=${newFolderInfo.id}" class="">
        <li class="folder">
          <i class="fa fa-folder"></i>
          <span> ${newFolderInfo.name}</span>
          <a onclick="return confirm('Are you sure to delete ${newFolderInfo.name} folder ? ')" class="trash" href="?deleteFolderId=${newFolderInfo.id}"><i class="fas fa-trash"></i></a>
        </li>
      </a>
      `
  );
  folderInput.value = null;
});

// add new task
document.querySelector('.addTaskInp').addEventListener('keypress', addNewTask);

async function addNewTask(event) {
  if (event.key === 'Enter') {
    let newTask = {
      title: event.target.value,
      folderId: document.querySelector('.activeFolder').dataset.id,
    };
    const taskCreationResult = await fetch('/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });
    const newTaskInfo = await taskCreationResult.json();
    location.reload();
  }
}
