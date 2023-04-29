<?php 
namespace App\Error;

use App\Middleware\CorsMiddleware;
use Cake\Controller\Controller;
use Cake\Error\ExceptionRenderer;

class AppExceptionRenderer extends ExceptionRenderer
{
    protected function _getController(): Controller
    {
        $controller = parent::_getController();

        $cors = new CorsMiddleware();
        $response = $cors->setHeaders(
            $controller->getRequest(),
            $controller->getResponse()
        );

        return $controller->setResponse($response);
    }
}