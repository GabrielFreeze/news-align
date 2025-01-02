import os
import cv2
import torch
import numpy as np
from PIL import Image
from pytorch_grad_cam import GradCAM, ScoreCAM, GradCAMPlusPlus
from pytorch_grad_cam.utils.image import show_cam_on_image, preprocess_image


class GradCamManager():
    def __init__(self, model:torch.nn.Module,resize_dim:int=256,batch_sz:int=128):

        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        #Smaller resize dimensions mean better GradCam inference.
        self.resize_dim = resize_dim
        self.batch_sz = batch_sz

        if not (
            hasattr(model,'forward') and callable(model.forward) and issubclass(type(model), torch.nn.Module) and
            hasattr(model,'targets') and not callable(model.targets) and
            hasattr(model,'reshape') and callable(model.reshape)
        ):
            raise Exception(f'{model} must inherit from torch.nn.Module and contian the above variables')
            
        self.model = model.to(self.device).eval()
    
    def __call__(self, img, txt=None, mask_weight:float=0.5,
                 eigen_smooth:bool=False,aug_smooth:bool=False, mask_only:bool=False):

        #Ensure type of img is np.array
        if type(img) is torch.Tensor:
            img = img.cpu().numpy()
        elif type(img) is str:
            #Attempt to laod image from disk
            img = cv2.imread(img, 1)[:, :, ::-1]
        else:
            img = np.array(img)
        
        #Save original image so we can overlay gradcam mask on it
        orig_h,orig_w,_ = img.shape
        orig_img = img
        
        img = cv2.resize(orig_img, (self.resize_dim,self.resize_dim))

        #I believe normalising the image using GradCam's default values interferes with BLIP's own normalisation,
        #so we disable normalisation by supplying None to `mean` and `std` parameters. (I modified the original Gradcam library)
        input_tensor = preprocess_image(img, mean=None,std=None)
        input_tensor.to(self.device).requires_grad_()

        #In the case GradCam is being performed on multimodal models, the `label` attribute is needed
        if hasattr(self.model,"label"):
            self.model.label = txt

        gradcam = GradCAMPlusPlus(
            model=self.model,
            target_layers=self.model.targets,
            reshape_transform=self.model.reshape
        )

        #Get heatmap, overlay on image, and save
        gradcam.batch_size = self.batch_sz
        gradcam_mask = gradcam(
            input_tensor=input_tensor,targets=None, #`targets=None` means to use the most significant layer
            eigen_smooth=eigen_smooth,aug_smooth=aug_smooth
        )
        
        #Resize mask to orginal image dimensions, and overlay.
        gradcam_mask = cv2.resize(gradcam_mask[0], (orig_w,orig_h))[:, :, np.newaxis]

        if mask_only:
            return gradcam_mask       

        #Return original image with mask on it
        cam_img = show_cam_on_image(np.float32(orig_img)/255,gradcam_mask,image_weight=mask_weight,use_rgb=True)
        return cam_img

