<?php
    //header('Content-Type: application/json');
    
    require 'PHPMailerAutoload.php';

    function process_files_array($files) {
        $processed_array = [];

        foreach($files as $index => $file) {
            // if (!is_array($file['name'])) {
            //     $processed_array[$index][] = $file;
            //     continue;
            // }

            foreach($file['name'] as $idx => $name) {
                $processed_array[$index][$idx] = [
                    'name' => $name,
                    'type' => $file['type'][$idx],
                    'tmp_name' => $file['tmp_name'][$idx],
                    'error' => $file['error'][$idx],
                    'size' => $file['size'][$idx]
                ];
            }
        }

        return $processed_array;
    }

    // Проверка на стороне сервера.
    function attachments_validation($files) {
        $validity = TRUE;
        $total_size = 0;
        
        foreach($files as $file => $attributes) {
            $total_size += $attributes['size'];
            $finfo = new finfo(FILEINFO_MIME_TYPE);

            if (($attributes['error'] > UPLOAD_ERR_OK) || (!isset($attributes['error']))) {
                $validity = FALSE;
                continue;
            }
            
            if (false === $ext = array_search($finfo->file($attributes['tmp_name']), 
                array(
                    'jpg' => 'image/jpeg',
                    'png' => 'image/png',
                    'gif' => 'image/gif',
                    'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'doc' => 'application/msword',  
                    'xls' => 'application/vnd.ms-excel',
                    'pdf' => 'application/pdf',
                    'zip' => 'application/zip',
                    'rar' => 'application/x-rar-compressed',
                    '7z' => 'application/x-7z-compressed',
                ), 
                true
            )) {
                $validity = FALSE;
            }

            if ($total_size > 26214400) {
                $validity = FALSE;
                break;
            }
        }

        return $validity;
    }

    if (isset($_POST)) {
        $name = $_POST['name'];
        $phone = $_POST['phone'];
        $email = $_POST['email'];
        $info = $_POST['info'];
        $emailTextHTML = $info . '<br>';
        $emailTextHTML .= '<br>тел. ' . $phone;
        $emailTextHTML .= '<br>email ' . $email;
        $attachments = process_files_array($_FILES)['attachments'];
        print_r($_FILES);

        $mail = new PHPMailer(true);
        $mail->CharSet = 'UTF-8';

        try {
            $mail->SMTPDebug = 0;
            $mail->isSMTP();

            $mail->Host = 'robots.1gb.ua';
            $mail->SMTPAuth = false;
            //$mail->SMTPSecure = 'tls';
            //$mail->Port = 587;
            //$mail->Port = 465;
            $mail->Port = 25;

            $mail->setFrom('mail@officerepair.com.ua', $name);
            $mail->addAddress('remontofisa@gmail.com');
            $mail->addReplyTo($email, $name);

            $mail->isHTML(true);
            $mail->Subject = 'Новая заявка!';
            $mail->Body = $emailTextHTML;
            //$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

            if (attachments_validation($attachments)) {
                foreach($attachments as $file => $attributes) {
                    $uploadfile = tempnam(sys_get_temp_dir(), hash('sha256', $attributes['name']));
                    
                    if (move_uploaded_file($attributes['tmp_name'], $uploadfile)) {
                        $mail->addAttachment($uploadfile, $attributes['name']);
                    }
    
                    //$mail->addAttachment($attributes['tmp_name'], $attributes['name']);
                }
            }

            //$mail->send();
            echo 'Заявка успешно отправлена';
        } catch (Exception $e) {
            echo 'При отправке возникла ошибка: ', $mail->ErrorInfo;
        }
    }
